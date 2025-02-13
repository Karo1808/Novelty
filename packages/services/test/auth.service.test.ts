import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  registerUser,
  sendVerificationEmail,
  verifyEmail,
} from "../auth.service";
import * as dbQueries from "@novelty/db/queries/auth.query";
import * as redisQueries from "@novelty/redis/queries/index.query";
import * as authUtils from "@novelty/lib/auth/cryptography";
import * as tokenGenerationUtils from "@novelty/lib/generate-verification-token";
import { verify } from "@node-rs/argon2";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { eq, sql } from "drizzle-orm";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import {
  DatabaseConnectionError,
  QueryExecutionError,
} from "@novelty/db/lib/errors";
import {
  testDb,
  testDependencies,
  testDependenciesWithQueue,
  testQueue,
  testRedis,
} from "../test-setup";
import { prepareDependencies } from "../lib/utils";
import {
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "../lib/config";
import * as queueUtils from "@novelty/message-queue/lib/add-job-to-queue";
import * as sessionService from "../session.service";
import { EnqueuingError } from "@novelty/message-queue/lib/error";
import type { VerifyEmailBodySchema } from "@novelty/lib/validations/auth";
import type { ServiceResponse } from "types";

const dummyBody: InsertUser["register"] = {
  email: "email@mail.com",
  password: "password123",
};

describe("auth service", () => {
  describe("registerUser", () => {
    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should handle successful signup", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashPassword");

      const result = await registerUser(testDependencies, dummyBody);

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(getUserByEmailQuerySpy).toHaveResolvedWith(undefined);
      expect(hashPasswordSpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).toHaveBeenCalledWith(dummyBody.password);
      expect(createUserQuerySpy).toHaveBeenCalledOnce();
      expect(result).toHaveProperty("status", HttpStatusCodes.CREATED);
      expect(result.body).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyBody.email as string),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const user = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.email, dummyBody.email as string),
      });
      expect(new Date(user!.createdAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(new Date(user!.updatedAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(user).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyBody.email as string),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(await verify(user!.password, dummyBody.password as string)).toBe(
        true,
      );
    });

    it("should handle email already existing", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashPassword");

      await testDb.insert(usersTable).values({
        email: dummyBody.email as string,
        password: dummyBody.password as string,
      });

      const result = await registerUser(testDependencies, dummyBody);
      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).not.toHaveBeenCalled();
      expect(createUserQuerySpy).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        status: HttpStatusCodes.CONFLICT,
      });

      const users = await testDb.query.usersTable.findMany({
        where: eq(usersTable.email, dummyBody.email as string),
      });
      expect(users).toHaveLength(1);
    });

    it("should handle no user returned upon creation", async () => {
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      createUserQuerySpy.mockImplementationOnce(() => Promise.resolve([]));

      await expect(registerUser(testDependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle database connection error", async () => {
      const dbClientSpy = vi
        .spyOn(testDependencies.dbInstance, "execute")
        .mockImplementation(() => {
          throw new DatabaseConnectionError("Database connection failed");
        });

      await expect(registerUser(testDependencies, dummyBody)).rejects.toThrow(
        DatabaseConnectionError,
      );
      dbClientSpy.mockRestore();
    });

    it("should handle invalid data from getUserByEmailQuery", async () => {
      vi.spyOn(dbQueries, "getUserByEmailQuery").mockResolvedValue(
        "unexpected-data" as any,
      );

      await expect(registerUser(testDependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle unexpected exceptions", async () => {
      vi.spyOn(authUtils, "hashPassword").mockImplementation(() => {
        throw new Error("Unexpected Error");
      });

      await expect(registerUser(testDependencies, dummyBody)).rejects.toThrow(
        Error,
      );
    });

    it.each([
      ["first parallel call", dummyBody],
      ["second parallel call", dummyBody],
    ])(
      "should handle race conditions for duplicate user creation (%s)",
      async (_, body) => {
        vi.spyOn(dbQueries, "getUserByEmailQuery").mockResolvedValue(undefined);
        const [result1, result2] = await Promise.all([
          registerUser(testDependencies, body),
          registerUser(testDependencies, body),
        ]);

        const statuses = [result1.status, result2.status];
        expect(statuses).toContain(HttpStatusCodes.CONFLICT);
        expect(statuses).toContain(HttpStatusCodes.CREATED);
      },
    );
  });

  describe("sendVerificationEmail", () => {
    const dummyToken = "12345";
    const dummyKey = `verify-email:${dummyBody.email}`;

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyBody);
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testQueue.obliterate();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should successfully complete all operations", async () => {
      const isLockAcquiredSpy = vi.spyOn(redisQueries, "acquireLock");
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      vi.spyOn(authUtils, "encryptString").mockReturnValue(dummyBody.email);

      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      generateVerificationTokenSpy.mockReturnValue(dummyToken);

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      const result = await sendVerificationEmail(testDependenciesWithQueue, {
        email: dummyBody.email as string,
      });

      expect(isLockAcquiredSpy).toHaveBeenCalledOnce();
      expect(isLockAcquiredSpy).toHaveResolvedWith("OK");

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();

      expect(generateVerificationTokenSpy).toHaveBeenCalledOnce();
      expect(generateVerificationTokenSpy).toHaveBeenCalledWith(
        VERIFICATION_EMAIL_TOKEN_LENGTH,
      );
      expect(generateVerificationTokenSpy).toHaveReturnedWith(dummyToken);

      expect(setWithExpirySpy).toHaveBeenCalledOnce();
      expect(setWithExpirySpy).toHaveBeenCalledWith(
        prepareDependencies(testDependenciesWithQueue, "dbInstance"),
        dummyKey,
        dummyToken,
        VERIFICATION_EMAIL_EXPIRY_TIME,
      );
      expect(setWithExpirySpy).toHaveResolved();

      expect(addJobToQueueSpy).toHaveBeenCalledOnce();
      expect(addJobToQueueSpy).toHaveBeenCalledWith(
        expect.any(Object),
        "send-verification-email",
        expect.objectContaining({ email: dummyBody.email, token: dummyToken }),
        expect.any(Object),
      );

      await vi.waitFor(
        async () => {
          const completedJobs = await testQueue.getCompleted();
          if (completedJobs.length === 0) {
            throw new Error("Job not completed yet");
          }
        },
        { timeout: 500, interval: 20 },
      );

      const [completedJob] = await testQueue.getCompleted();

      expect(completedJob.queue.name).toBe("email-queue");
      expect(completedJob.name).toBe("send-verification-email");
      expect(completedJob.data).toEqual({
        email: dummyBody.email,
        token: dummyToken,
      });
      expect(completedJob.id).toBe("test-req-id");

      expect(deleteByKeySpy).not.toHaveBeenCalled();

      expect(releaseLockSpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.body).toBe(dummyBody.email);

      const redisToken = await testRedis.get(dummyKey);
      expect(redisToken).toBe(dummyToken);

      const ttl = await testRedis.ttl(dummyKey);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(VERIFICATION_EMAIL_EXPIRY_TIME);
    });

    it("should handle lock not acquired", async () => {
      const acquireLockSpy = vi
        .spyOn(redisQueries, "acquireLock")
        .mockResolvedValue(null);

      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");

      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );
      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      const result = await sendVerificationEmail(testDependenciesWithQueue, {
        email: dummyBody.email as string,
      });

      expect(acquireLockSpy).toHaveBeenCalledOnce();
      expect(acquireLockSpy).toHaveResolvedWith(null);

      expect(getUserByEmailQuerySpy).not.toHaveBeenCalled();
      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();
      expect(releaseLockSpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.CONFLICT);
      expect(result).toHaveProperty("error");
    });

    it("should allow only one process to acquire the lock (simulate race condition)", async () => {
      let lockAcquired = false;

      const acquireLockSpy = vi
        .spyOn(redisQueries, "acquireLock")
        .mockImplementation(async () => {
          if (!lockAcquired) {
            lockAcquired = true;
            return "OK";
          }
          return null;
        });

      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      vi.clearAllMocks();

      const [firstCall, secondCall] = await Promise.allSettled([
        sendVerificationEmail(testDependenciesWithQueue, {
          email: dummyBody.email,
        }),
        sendVerificationEmail(testDependenciesWithQueue, {
          email: dummyBody.email,
        }),
      ]);

      expect(acquireLockSpy).toHaveBeenCalledTimes(2);
      expect(acquireLockSpy).toHaveResolvedWith("OK");
      expect(acquireLockSpy).toHaveResolvedWith(null);

      if (firstCall.status === "fulfilled") {
        expect(firstCall.value).toMatchObject({ status: HttpStatusCodes.OK });
      }
      else {
        throw new Error(`First call was rejected: ${firstCall.reason}`);
      }

      if (secondCall.status === "fulfilled") {
        expect(secondCall.value.status).toBe(HttpStatusCodes.CONFLICT);
        expect(secondCall.value).toHaveProperty("error");
      }
      else {
        throw new Error(`Second call was rejected: ${secondCall.reason}`);
      }

      expect(addJobToQueueSpy).toHaveBeenCalledTimes(1);

      expect(releaseLockSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle user not found", async () => {
      const getUserByEmailQuery = vi.spyOn(dbQueries, "getUserByEmailQuery");

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      await testDb.delete(usersTable);

      const result = await sendVerificationEmail(testDependenciesWithQueue, {
        email: dummyBody.email as string,
      });

      expect(getUserByEmailQuery).toHaveBeenCalledOnce();
      expect(getUserByEmailQuery).toHaveResolvedWith(undefined);

      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(setWithExpirySpy).not.toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle user already verified", async () => {
      const getUserByEmailQuery = vi.spyOn(dbQueries, "getUserByEmailQuery");

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      await testDb
        .update(usersTable)
        .set({
          isEmailVerified: true,
        })
        .where(eq(usersTable.email, dummyBody.email));

      const result = await sendVerificationEmail(testDependenciesWithQueue, {
        email: dummyBody.email as string,
      });

      expect(getUserByEmailQuery).toHaveBeenCalledOnce();
      expect(getUserByEmailQuery).toHaveResolvedWith(
        expect.objectContaining({
          id: expect.stringMatching(/^[\w-]{21}$/),
          email: expect.stringMatching(dummyBody.email as string),
          isEmailVerified: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(setWithExpirySpy).not.toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should handle error when enqueueing the job", async () => {
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      const addJobToQueueSpy = vi
        .spyOn(queueUtils, "addJobToQueue")
        .mockRejectedValue(new Error("Queue failure"));
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      vi.clearAllMocks();

      await expect(
        sendVerificationEmail(testDependenciesWithQueue, {
          email: dummyBody.email as string,
        }),
      ).rejects.toThrowError(EnqueuingError);

      const jobs = await testQueue.getJobs();

      expect(jobs.length).toBe(0);

      expect(addJobToQueueSpy).toHaveBeenCalledOnce();
      expect(deleteByKeySpy).toHaveBeenCalledOnce();

      // verify that the token has been deleted successfully
      const queryResult = await testRedis.get(
        `verify-email:${dummyBody.email}`,
      );
      expect(queryResult).toBeFalsy();

      expect(releaseLockSpy).toHaveBeenCalledOnce();
    });

    it("should handle Redis setWithExpiry failure", async () => {
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      vi.spyOn(redisQueries, "setWithExpiry").mockRejectedValue(
        new Error("Redis error"),
      );

      vi.clearAllMocks();

      await expect(
        sendVerificationEmail(testDependenciesWithQueue, {
          email: dummyBody.email,
        }),
      ).rejects.toThrowError("Redis error");

      expect(addJobToQueueSpy).not.toHaveBeenCalled();
      expect(releaseLockSpy).toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      vi.spyOn(dbQueries, "getUserByEmailQuery").mockRejectedValue(
        new Error("DB error"),
      );

      await expect(
        sendVerificationEmail(testDependenciesWithQueue, {
          email: dummyBody.email,
        }),
      ).rejects.toThrowError("DB error");

      expect(releaseLockSpy).toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    const dummyUser = {
      id: "dummy-id",
      email: "email@mail.com",
      password: "password123",
    };

    const dummyKey = `verify-email:${dummyUser.id}`;
    const dummyToken = "12345";
    const dummySessionToken = "session123";

    const dummyBody: VerifyEmailBodySchema = {
      encryptedUserId: dummyUser.id,
      verificationCode: dummyToken,
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);
      await testRedis.set(dummyKey, dummyToken);
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should successfully complete all operations", async () => {
      const getByKeySpy = vi.spyOn(redisQueries, "getByKey");
      const decryptStringSpy = vi
        .spyOn(authUtils, "decryptString")
        .mockReturnValue(dummyUser.id);
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );
      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");
      const generateSessionTokenSpy = vi
        .spyOn(sessionService, "generateSessionToken")
        .mockReturnValue(dummySessionToken);
      const createSessionSpy = vi.spyOn(sessionService, "createSession");

      await testRedis.set(dummyKey, dummyToken);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(getByKeySpy).toHaveBeenCalledOnce();
      expect(getByKeySpy).toHaveResolvedWith(dummyToken);

      expect(decryptStringSpy).toHaveBeenCalledOnce();
      expect(decryptStringSpy).toHaveReturnedWith(dummyUser.id);

      expect(getIsEmailVerifiedQuerySpy).toHaveBeenCalledOnce();
      expect(getIsEmailVerifiedQuerySpy).toHaveResolvedWith({
        isEmailVerified: false,
      });

      expect(updateUserByIdQuerySpy).toHaveBeenCalledOnce();
      const dbQueryResult = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUser.id),
      });
      expect(dbQueryResult?.isEmailVerified).toBe(true);

      expect(deleteByKeySpy).toHaveBeenCalledOnce();
      const redisQueryResult = await testRedis.get(dummyKey);
      expect(redisQueryResult).toBe(null);

      expect(generateSessionTokenSpy).toHaveBeenCalledOnce();
      expect(generateSessionTokenSpy).toHaveReturnedWith(dummySessionToken);

      expect(createSessionSpy).toHaveBeenCalledOnce();
      const mockReturnPromise: Promise<sessionService.Session>
        = createSessionSpy.mock.results[0]?.value;

      const { id, userId } = await mockReturnPromise;

      const key = `session:${id}`;
      const session = JSON.parse((await testRedis.get(key)) as string);

      expect(session).toMatchObject({
        user_id: userId,
      });

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.data).toMatchObject({
        sessionToken: dummySessionToken,
      });
    });

    it("should handle invalid verification code", async () => {
      const getByKeySpy = vi.spyOn(redisQueries, "getByKey");
      const decryptStringSpy = vi
        .spyOn(authUtils, "decryptString")
        .mockReturnValue(dummyUser.id);
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );
      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      await testRedis.del(dummyKey);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(getByKeySpy).toHaveBeenCalledOnce();
      expect(getByKeySpy).toHaveResolvedWith(null);

      expect(decryptStringSpy).not.toHaveBeenCalled();
      expect(deleteByKeySpy).not.toHaveBeenCalled();
      expect(getIsEmailVerifiedQuerySpy).not.toHaveBeenCalled();
      expect(updateUserByIdQuerySpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("should handle email already verified", async () => {
      const getByKeySpy = vi.spyOn(redisQueries, "getByKey");
      const decryptStringSpy = vi
        .spyOn(authUtils, "decryptString")
        .mockReturnValue(dummyUser.id);
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );
      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      await testRedis.set(dummyKey, dummyToken);

      await testDb
        .update(usersTable)
        .set({ isEmailVerified: true })
        .where(eq(usersTable.id, dummyUser.id));

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(getByKeySpy).toHaveBeenCalledOnce();
      expect(getByKeySpy).toHaveResolvedWith(dummyToken);
      expect(decryptStringSpy).toHaveBeenCalledOnce();
      expect(deleteByKeySpy).toHaveBeenCalled();
      expect(getIsEmailVerifiedQuerySpy).toHaveBeenCalled();

      expect(updateUserByIdQuerySpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should handle non-existent user", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      await testDb.execute(sql`TRUNCATE table users CASCADE`);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should throw error when updateUserByIdQuery returns an empty array", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      vi.spyOn(dbQueries, "updateUserByIdQuery").mockResolvedValueOnce([]);

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle field not updated", async () => {
      const currentUser = await testDb.query.usersTable.findFirst();
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      updateUserByIdQuerySpy.mockImplementationOnce(() =>
        Promise.resolve([currentUser!]),
      );

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        QueryExecutionError,
      );
    });

    it("should handle database connection error", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      const dbClientSpy = vi
        .spyOn(testDependencies.dbInstance, "execute")
        .mockImplementation(() => {
          throw new DatabaseConnectionError("Database connection failed");
        });

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        DatabaseConnectionError,
      );
      dbClientSpy.mockRestore();
    });

    it("should propagate errors thrown during Redis key deletion", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      vi.spyOn(redisQueries, "deleteByKey").mockRejectedValueOnce(
        new Error("Redis deletion failed"),
      );

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        "Redis deletion failed",
      );
    });

    it("should handle unexpected exceptions", async () => {
      vi.spyOn(authUtils, "decryptString").mockImplementation(() => {
        throw new Error("Unexpected Error");
      });

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        Error,
      );
    });

    it("should return conflict on a second verification attempt", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      const firstResult = await verifyEmail(testDependencies, dummyBody);
      expect(firstResult.status).toBe(HttpStatusCodes.OK);

      await testRedis.set(dummyKey, dummyToken);

      const secondResult = await verifyEmail(testDependencies, dummyBody);
      expect(secondResult.status).toBe(HttpStatusCodes.CONFLICT);
    });

    describe("verifyEmail - concurrency", () => {
      it("should handle concurrent verification requests properly", async () => {
        vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

        const concurrentCalls = 5;
        const promises = Array.from({ length: concurrentCalls }, () =>
          verifyEmail(testDependencies, dummyBody));

        const results = await Promise.allSettled(promises);

        const okResults = results.filter(
          result =>
            result.status === "fulfilled"
            && (result as PromiseFulfilledResult<ServiceResponse<any>>).value.status === HttpStatusCodes.OK,
        );
        const conflictResults = results.filter(
          result =>
            result.status === "fulfilled"
            && (result as PromiseFulfilledResult<ServiceResponse<any>>).value.status === HttpStatusCodes.CONFLICT,
        );

        expect(okResults.length).toBe(1);
        expect(conflictResults.length).toBe(concurrentCalls - 1);

        const redisResult = await testRedis.get(dummyKey);
        expect(redisResult).toBe(null);
      });
    });

    describe("verifyEmail - concurrency with invalid code", () => {
      it("should have all concurrent calls return BAD_REQUEST if the verification code is missing", async () => {
        await testRedis.del(dummyKey);

        const concurrentCalls = 3;
        const promises = Array.from({ length: concurrentCalls }, () =>
          verifyEmail(testDependencies, dummyBody));

        const results = await Promise.allSettled(promises);

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            expect(result.value.status).toBe(HttpStatusCodes.BAD_REQUEST);
          }
        });
      });
    });
  });
});

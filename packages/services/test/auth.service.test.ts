import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticateOAuthUser,
  createAuthenticatedSessionResponse,
  forgotPassword,
  initOAuth,
  loginUser,
  logoutUser,
  oAuthCallback,
  registerUser,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyEmail,
} from "../auth.service";
import * as authService from "../auth.service";
import * as dbQueries from "@novelty/db/queries/auth.query";
import * as userDbQueries from "@novelty/db/queries/user.query";
import * as redisQueries from "@novelty/redis/queries/index.query";
import * as authUtils from "@novelty/lib/auth/cryptography";
import * as tokenGenerationUtils from "@novelty/lib/generate-verification-token";
import { verify } from "@node-rs/argon2";
import { eq, sql } from "drizzle-orm";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import { authProvidersTable } from "@novelty/db/schemas/auth-provider.schema";
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
import {
  GOOGLE_SCOPES,
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "../lib/config";
import * as queueUtils from "@novelty/message-queue/lib/add-job-to-queue";
import * as sessionService from "../session.service";
import { EnqueuingError } from "@novelty/message-queue/lib/error";
import type { VerifyEmailBodySchema } from "@novelty/lib/validations/auth";
import type { InsertUserInfo } from "@novelty/db/schemas/user-info.schema";
import { userInfoTable } from "@novelty/db/schemas/user-info.schema";
import { OAuth2RequestError } from "arctic";

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
      const hashPasswordSpy = vi.spyOn(authUtils, "hashString");

      const result = await registerUser(testDependencies, dummyBody);
      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(getUserByEmailQuerySpy).toHaveResolvedWith(undefined);
      expect(hashPasswordSpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).toHaveBeenCalledWith(dummyBody.password);
      expect(createUserQuerySpy).toHaveBeenCalledOnce();
      expect(result).toMatchObject({
        success: true,
        data: {
          id: expect.stringMatching(/^[\w-]{21}$/),
          email: expect.stringMatching(dummyBody.email as string),
          isEmailVerified: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
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

      expect(await verify(user!.password!, dummyBody.password as string)).toBe(
        true,
      );
    });

    it("should handle email already existing", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashString");

      await testDb.insert(usersTable).values({
        email: dummyBody.email as string,
        password: dummyBody.password as string,
      });

      const result = await registerUser(testDependencies, dummyBody);
      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).not.toHaveBeenCalled();
      expect(createUserQuerySpy).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });

      const users = await testDb.query.usersTable.findMany({
        where: eq(usersTable.email, dummyBody.email as string),
      });
      expect(users).toHaveLength(1);
    });

    it("should handle no user returned upon creation", async () => {
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      createUserQuerySpy.mockImplementationOnce(() => Promise.resolve(null));

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

      const res = await registerUser(testDependencies, dummyBody);

      expect(res).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });
    });

    it("should handle unexpected exceptions", async () => {
      vi.spyOn(authUtils, "hashString").mockImplementation(() => {
        throw new Error("Unexpected Error");
      });

      await expect(registerUser(testDependencies, dummyBody)).rejects.toThrow(
        Error,
      );
    });
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
      const acquireLockSpy = vi.spyOn(redisQueries, "acquireLock");
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

      expect(acquireLockSpy).toHaveBeenCalledOnce();

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();

      expect(generateVerificationTokenSpy).toHaveBeenCalledOnce();
      expect(generateVerificationTokenSpy).toHaveBeenCalledWith(
        VERIFICATION_EMAIL_TOKEN_LENGTH,
      );
      expect(generateVerificationTokenSpy).toHaveReturnedWith(dummyToken);

      expect(setWithExpirySpy).toHaveBeenCalledOnce();
      expect(setWithExpirySpy).toHaveBeenCalledWith(
        testDependenciesWithQueue,
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

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });

      const redisToken = await testRedis.get(dummyKey);
      expect(redisToken).toBe(dummyToken);

      const ttl = await testRedis.ttl(dummyKey);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(VERIFICATION_EMAIL_EXPIRY_TIME);
    });

    it("should handle lock not acquired", async () => {
      const acquireLockSpy = vi
        .spyOn(redisQueries, "acquireLock")
        .mockResolvedValue(false);

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
      expect(acquireLockSpy).toHaveResolvedWith(false);

      expect(getUserByEmailQuerySpy).not.toHaveBeenCalled();
      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();
      expect(releaseLockSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });
    });

    it("should handle user not found", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");

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

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(getUserByEmailQuerySpy).toHaveResolvedWith(undefined);

      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(setWithExpirySpy).not.toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "NOT_FOUND",
          message: expect.any(String),
        },
      });
    });

    it("should handle user already verified", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      const deleteSpy = vi.spyOn(redisQueries, "deleteByKey");

      await testDb
        .update(usersTable)
        .set({
          isEmailVerified: true,
        })
        .where(eq(usersTable.email, dummyBody.email));

      const result = await sendVerificationEmail(testDependenciesWithQueue, {
        email: dummyBody.email as string,
      });

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(getUserByEmailQuerySpy).toHaveResolvedWith(
        expect.objectContaining({
          id: expect.stringMatching(/^[\w-]{21}$/),
          email: expect.stringMatching(dummyBody.email as string),
          isEmailVerified: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(generateVerificationTokenSpy).toHaveBeenCalled();
      expect(setWithExpirySpy).toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });

      const redisQueryResult = await testRedis.get(dummyKey);
      expect(redisQueryResult).toBe(null);
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

    const dummyKey = `verify-email:${dummyUser.email}`;
    const dummyToken = "12345";

    const dummyBody: VerifyEmailBodySchema = {
      email: dummyUser.email,
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
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      await testRedis.set(dummyKey, dummyToken);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(getByKeySpy).toHaveBeenCalledOnce();
      expect(getByKeySpy).toHaveResolvedWith(dummyToken);

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();

      expect(updateUserByIdQuerySpy).toHaveBeenCalledOnce();
      const dbQueryResult = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUser.id),
      });
      expect(dbQueryResult?.isEmailVerified).toBe(true);

      expect(deleteByKeySpy).toHaveBeenCalledOnce();
      const redisQueryResult = await testRedis.get(dummyKey);
      expect(redisQueryResult).toBe(null);

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });
    });

    it("should handle invalid verification code", async () => {
      const getByKeySpy = vi.spyOn(redisQueries, "getByKey");
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const updateUserByIdQuerySpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      await testRedis.del(dummyKey);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(getByKeySpy).toHaveBeenCalledOnce();
      expect(getByKeySpy).toHaveResolvedWith(null);

      expect(deleteByKeySpy).not.toHaveBeenCalled();
      expect(getUserByEmailQuerySpy).not.toHaveBeenCalled();
      expect(updateUserByIdQuerySpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "BAD_REQUEST",
          message: expect.any(String),
        },
      });
    });

    it("should handle email already verified", async () => {
      const getByKeySpy = vi.spyOn(redisQueries, "getByKey");
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
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
      expect(deleteByKeySpy).toHaveBeenCalled();
      expect(getUserByEmailQuerySpy).toHaveBeenCalled();

      expect(updateUserByIdQuerySpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });
    });

    it("should handle non-existent user", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      await testDb.execute(sql`TRUNCATE table users CASCADE`);

      const result = await verifyEmail(testDependencies, dummyBody);

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "NOT_FOUND",
          message: expect.any(String),
        },
      });
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

    it("should propagate errors thrown during Redis key deletion", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      vi.spyOn(redisQueries, "deleteByKey").mockRejectedValueOnce(
        new Error("Redis deletion failed"),
      );

      await expect(verifyEmail(testDependencies, dummyBody)).rejects.toThrow(
        "Redis deletion failed",
      );
    });

    it("should return conflict on a second verification attempt", async () => {
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);

      const firstResult = await verifyEmail(testDependencies, dummyBody);
      expect(firstResult.success).toBe(true);

      await testRedis.set(dummyKey, dummyToken);

      const secondResult = await verifyEmail(testDependencies, dummyBody);
      expect(secondResult.success).toBe(false);
    });
  });

  describe("loginUser", async () => {
    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: ["genre1", "genre2", "genre3"],
        authors: ["author"],
        series: ["series"],
      },
      profile: {
        avatarUrl: "",
        bio: "bio",
        username: "username",
      },
    };

    const dummyPassword: string = await authUtils.hashString(
      dummyBody.password!,
    );

    const dummyUser = {
      email: "email@mail.com",
      password: dummyPassword,
      id: "123",
      isEmailVerified: true,
    };

    const dummyToken = "session123";
    const dummySessionId = "dummy-session-id";

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);

      await testDb.insert(userInfoTable).values({
        userId: dummyUser.id,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });

      vi.spyOn(authUtils, "encodeToken").mockReturnValue(dummySessionId);
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should handle successful login", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const hexistsQuerySpy = vi.spyOn(redisQueries, "hexistsQuery");
      const verifyHashSpy = vi.spyOn(authUtils, "verifyHash");
      const generateSessionTokenSpy = vi
        .spyOn(sessionService, "generateSessionToken")
        .mockReturnValue(dummyToken);
      const createSessionSpy = vi.spyOn(sessionService, "createSession");
      const getUserInfoQuerySpy = vi.spyOn(userDbQueries, "getUserInfoQuery");

      const result = await loginUser(
        testDependencies,
        dummyBody as InsertUser["login"],
      );

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hexistsQuerySpy).toHaveBeenCalledOnce();
      expect(verifyHashSpy).toHaveBeenCalledOnce();
      expect(getUserInfoQuerySpy).toHaveBeenCalledOnce();
      expect(generateSessionTokenSpy).toHaveBeenCalledOnce();
      expect(createSessionSpy).toHaveBeenCalledOnce();

      expect(result).toMatchObject({
        success: true,
        data: {
          token: dummyToken,
          expiresAt: expect.any(Date),
          user: {
            id: dummyUser.id,
            isEmailVerified: true,
            isOnboarded: false,
            userInfo: {
              profile: {
                avatarUrl: dummyUserInfo.profile.avatarUrl,
                bio: dummyUserInfo.profile.bio,
                username: dummyUserInfo.profile.username,
              },
              preferences: dummyUserInfo.preferences,
            },
          },
        },
      });

      const session = await testRedis.get(`session:${dummySessionId}`);
      expect(session).toBeTruthy();

      const sessionKey = `session:${dummySessionId}`;
      const expiresAt = await testRedis.ttl(sessionKey);
      expect(expiresAt).toBeGreaterThan(0);
      expect(expiresAt).toBeLessThanOrEqual(
        sessionService.SESSION_EXPIRATION_TIME,
      );

      const userSessions = await testRedis.smembers(
        `user_sessions:${dummyUser.id}`,
      );
      expect(userSessions).toHaveLength(1);
      expect(userSessions).toContain(dummySessionId);
    });

    it("should handle user not found but return unauthorized", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const hexistsQuerySpy = vi.spyOn(redisQueries, "hexistsQuery");
      const verifyPasswordSpy = vi.spyOn(authUtils, "verifyHash");
      const generateSessionTokenSpy = vi
        .spyOn(sessionService, "generateSessionToken")
        .mockReturnValue(dummyToken);
      const createSessionSpy = vi.spyOn(sessionService, "createSession");
      const getUserInfoQuerySpy = vi.spyOn(userDbQueries, "getUserInfoQuery");

      await testDb.delete(usersTable);

      const result = await loginUser(
        testDependencies,
        dummyBody as InsertUser["login"],
      );

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hexistsQuerySpy).toHaveBeenCalledOnce();
      expect(verifyPasswordSpy).toHaveBeenCalled();
      expect(getUserInfoQuerySpy).not.toHaveBeenCalled();
      expect(generateSessionTokenSpy).not.toHaveBeenCalled();
      expect(createSessionSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "UNAUTHORIZED",
          message: expect.any(String),
        },
      });
    });

    it("should handle password mismatch", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const hexistsQuerySpy = vi.spyOn(redisQueries, "hexistsQuery");
      const verifyPasswordSpy = vi.spyOn(authUtils, "verifyHash");
      const generateSessionTokenSpy = vi
        .spyOn(sessionService, "generateSessionToken")
        .mockReturnValue(dummyToken);
      const createSessionSpy = vi.spyOn(sessionService, "createSession");
      const getUserInfoQuerySpy = vi.spyOn(userDbQueries, "getUserInfoQuery");

      const result = await loginUser(testDependencies, {
        ...dummyBody,
        password: "wrongpassword",
      });

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hexistsQuerySpy).toHaveBeenCalledOnce();
      expect(verifyPasswordSpy).toHaveBeenCalledOnce();
      expect(getUserInfoQuerySpy).not.toHaveBeenCalled();
      expect(generateSessionTokenSpy).not.toHaveBeenCalled();
      expect(createSessionSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "UNAUTHORIZED",
          message: expect.any(String),
        },
      });
    });

    it("should handle blacklisted user", async () => {
      const blacklistKey = `blacklist`;
      await testRedis.hset(blacklistKey, dummyUser.id, "true");

      const result = await loginUser(
        testDependencies,
        dummyBody as InsertUser["login"],
      );

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "FORBIDDEN",
          message: expect.any(String),
        },
      });
    });

    it("should handle database connection error", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      getUserByEmailQuerySpy.mockRejectedValue(
        new DatabaseConnectionError("DB connection failed"),
      );

      await expect(
        loginUser(testDependencies, dummyBody as InsertUser["login"]),
      ).rejects.toThrow(DatabaseConnectionError);
    });

    it("should handle unexpected errors", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      getUserByEmailQuerySpy.mockRejectedValue(new Error("Unexpected error"));

      await expect(
        loginUser(testDependencies, dummyBody as InsertUser["login"]),
      ).rejects.toThrow(Error);
    });
  });

  describe("logoutUser", () => {
    const dummyUserId = "user-123";
    const dummySessionId = "session-abc";

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should successfully invalidate the session", async () => {
      const invalidateSessionSpy = vi.spyOn(
        sessionService,
        "invalidateSession",
      );

      await logoutUser(testDependencies, dummyUserId, dummySessionId);

      expect(invalidateSessionSpy).toHaveBeenCalledOnce();
      expect(invalidateSessionSpy).toHaveBeenCalledWith(
        testDependencies,
        dummySessionId,
        dummyUserId,
      );

      const sessionKey = `session:${dummySessionId}`;
      const sessionData = await testRedis.get(sessionKey);
      expect(sessionData).toBeNull();
    });

    it("should propagate errors from invalidateSession", async () => {
      const invalidateSessionSpy = vi
        .spyOn(sessionService, "invalidateSession")
        .mockRejectedValue(new Error("Redis error"));

      await expect(
        logoutUser(testDependencies, dummyUserId, dummySessionId),
      ).rejects.toThrow("Redis error");

      expect(invalidateSessionSpy).toHaveBeenCalledOnce();
    });
  });
  describe("sendForgotPasswordEmail", () => {
    const dummyEmail = "test@example.com";
    const dummyToken = "dummy-token";
    const dummyKey = `forgot-password:###${dummyToken}`;

    beforeEach(async () => {
      await testDb.insert(usersTable).values({
        id: "dummy-id",
        email: dummyEmail,
        password: "password123",
      });
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testQueue.obliterate();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should successfully send forgot password email", async () => {
      const acquireLockSpy = vi.spyOn(redisQueries, "acquireLock");
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const generatePasswordResetTokenSpy = vi
        .spyOn(authUtils, "generatePasswordResetToken")
        .mockReturnValue({
          rawToken: dummyToken,
          hashedToken: `###${dummyToken}`,
        });
      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");
      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");

      const result = await sendForgotPasswordEmail(testDependenciesWithQueue, {
        email: dummyEmail,
      });

      expect(acquireLockSpy).toHaveBeenCalledOnce();

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();

      expect(generatePasswordResetTokenSpy).toHaveBeenCalledOnce();
      expect(generatePasswordResetTokenSpy).toHaveReturnedWith({
        rawToken: dummyToken,
        hashedToken: `###${dummyToken}`,
      });

      expect(setWithExpirySpy).toHaveBeenCalledOnce();
      expect(addJobToQueueSpy).toHaveBeenCalledOnce();

      expect(addJobToQueueSpy).toHaveBeenCalledWith(
        expect.any(Object),
        "send-forgot-password-email",
        expect.objectContaining({ email: dummyEmail, token: dummyToken }),
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
      expect(completedJob.name).toBe("send-forgot-password-email");
      expect(completedJob.data).toEqual({
        email: dummyEmail,
        token: dummyToken,
      });
      expect(completedJob.id).toBe("test-req-id");

      expect(deleteByKeySpy).not.toHaveBeenCalled();

      expect(releaseLockSpy).toHaveBeenCalledOnce();

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });

      const redisValue = await testRedis.get(dummyKey);
      expect(redisValue).toBe("dummy-id");
    });

    it("should handle lock not acquired", async () => {
      const acquireLockSpy = vi
        .spyOn(redisQueries, "acquireLock")
        .mockResolvedValue(false);
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");

      const result = await sendForgotPasswordEmail(testDependenciesWithQueue, {
        email: dummyEmail,
      });

      expect(acquireLockSpy).toHaveBeenCalledOnce();
      expect(releaseLockSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });
    });

    it("should handle blacklisted user", async () => {
      const hexistsQuerySpy = vi.spyOn(redisQueries, "hexistsQuery");
      const blacklistKey = `blacklist`;
      await testRedis.hset(blacklistKey, "dummy-id", "true");

      const result = await sendForgotPasswordEmail(testDependenciesWithQueue, {
        email: dummyEmail,
      });

      expect(hexistsQuerySpy).toHaveBeenCalledOnce();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "FORBIDDEN",
          message: expect.any(String),
        },
      });
    });

    it("should handle user not found", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      getUserByEmailQuerySpy.mockResolvedValue(undefined);
      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");
      const addJobToQueueSpy = vi.spyOn(queueUtils, "addJobToQueue");

      const result = await sendForgotPasswordEmail(testDependenciesWithQueue, {
        email: "nonexistent@example.com",
      });

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(setWithExpirySpy).toHaveBeenCalled();
      expect(addJobToQueueSpy).not.toHaveBeenCalled();

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });
    });

    it("should handle error when enqueueing the job", async () => {
      const addJobToQueueSpy = vi
        .spyOn(queueUtils, "addJobToQueue")
        .mockRejectedValue(new Error("Queue failure"));
      const deleteByKeySpy = vi.spyOn(redisQueries, "deleteByKey");
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");

      await expect(
        sendForgotPasswordEmail(testDependenciesWithQueue, {
          email: dummyEmail,
        }),
      ).rejects.toThrowError(EnqueuingError);

      expect(addJobToQueueSpy).toHaveBeenCalledOnce();
      expect(deleteByKeySpy).toHaveBeenCalledOnce();
      expect(releaseLockSpy).toHaveBeenCalledOnce();
    });

    it("should handle Redis setWithExpiry failure", async () => {
      const setWithExpirySpy = vi
        .spyOn(redisQueries, "setWithExpiry")
        .mockRejectedValue(new Error("Redis error"));
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");

      await expect(
        sendForgotPasswordEmail(testDependenciesWithQueue, {
          email: dummyEmail,
        }),
      ).rejects.toThrowError("Redis error");

      expect(setWithExpirySpy).toHaveBeenCalledOnce();
      expect(releaseLockSpy).toHaveBeenCalledOnce();
    });

    it("should handle database errors", async () => {
      const getUserByEmailQuerySpy = vi
        .spyOn(dbQueries, "getUserByEmailQuery")
        .mockRejectedValue(new Error("DB error"));
      const releaseLockSpy = vi.spyOn(redisQueries, "releaseLock");

      await expect(
        sendForgotPasswordEmail(testDependenciesWithQueue, {
          email: dummyEmail,
        }),
      ).rejects.toThrowError("DB error");

      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(releaseLockSpy).toHaveBeenCalledOnce();
    });
  });

  describe("forgotPassword", () => {
    const dummyUserId = "user-123";
    const dummyToken = "valid-token";
    const dummyHashedToken = "hashed-valid-token";
    const newPassword = "newSecurePassword123";

    const dummyUserInfo = {
      userId: dummyUserId,
      avatarUrl: "https://example.com/avatar.png",
      bio: "I am a test user",
      username: "testuser",
      preferences: {
        genres: ["genre1", "genre2", "genre3"],
        authors: ["author1", "author2"],
        series: ["series1", "series2"],
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values({
        id: dummyUserId,
        email: "user@example.com",
        password: await authUtils.hashString("oldPassword"),
        isEmailVerified: true,
      });

      await testDb.insert(userInfoTable).values({
        userId: dummyUserId,
        avatarUrl: "https://example.com/avatar.png",
        bio: "I am a test user",
        username: "testuser",
        preferences: {
          genres: ["genre1", "genre2", "genre3"],
          authors: ["author1", "author2"],
          series: ["series1", "series2"],
        },
      });

      vi.spyOn(authUtils, "encodeToken").mockReturnValue(dummyHashedToken);
      vi.spyOn(authUtils, "hashString").mockResolvedValue(
        await authUtils.hashString(newPassword),
      );
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should successfully reset password and create new session", async () => {
      await testRedis.set(`forgot-password:${dummyHashedToken}`, dummyUserId);
      const getUserByIdSpy = vi.spyOn(dbQueries, "getUserByIdQuery");
      const updateUserSpy = vi.spyOn(dbQueries, "updateUserByIdQuery");
      const deleteKeySpy = vi.spyOn(redisQueries, "deleteByKey");
      const invalidateSessionsSpy = vi.spyOn(
        sessionService,
        "invalidateAllSessions",
      );

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: dummyToken,
      });

      expect(getUserByIdSpy).toHaveBeenCalledWith(
        expect.anything(),
        dummyUserId,
      );
      expect(updateUserSpy).toHaveBeenCalledWith(
        expect.anything(),
        { password: expect.any(String) },
        dummyUserId,
      );
      expect(deleteKeySpy).toHaveBeenCalledWith(
        expect.anything(),
        `forgot-password:${dummyHashedToken}`,
      );
      expect(invalidateSessionsSpy).toHaveBeenCalledWith(
        expect.anything(),
        dummyUserId,
      );

      const user = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUserId),
      });
      expect(await authUtils.verifyHash(newPassword, user!.password!)).toBe(
        true,
      );

      expect(result).toMatchObject({
        success: true,
        data: {
          token: expect.any(String),
          expiresAt: expect.any(Date),
          user: {
            id: dummyUserId,
            isEmailVerified: true,
            isOnboarded: false,
            userInfo: {
              profile: {
                avatarUrl: dummyUserInfo.avatarUrl,
                bio: dummyUserInfo.bio,
                username: dummyUserInfo.username,
              },
              preferences: dummyUserInfo.preferences,
            },
          },
        },
      });
    });

    it("should handle lock not acquired", async () => {
      vi.spyOn(redisQueries, "acquireLock").mockResolvedValue(false);

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: dummyToken,
      });

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "CONFLICT",
          message: expect.any(String),
        },
      });
    });

    it("should return bad request for invalid token", async () => {
      vi.spyOn(redisQueries, "getByKey").mockResolvedValue(null);

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: "invalid-token",
      });

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "BAD_REQUEST",
          message: expect.any(String),
        },
      });
    });

    it("should handle user not found, but return bad request", async () => {
      await testRedis.set(
        `forgot-password:${dummyHashedToken}`,
        "non-existent-user",
      );
      const deleteSpy = vi.spyOn(redisQueries, "deleteByKey");

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: dummyToken,
      });

      expect(deleteSpy).toHaveBeenCalled();

      expect(result).toMatchObject({
        success: false,
        error: {
          kind: "BAD_REQUEST",
          message: expect.any(String),
        },
      });
    });

    it("should handle database update failure", async () => {
      await testRedis.set(`forgot-password:${dummyHashedToken}`, dummyUserId);
      vi.spyOn(dbQueries, "updateUserByIdQuery").mockRejectedValue(
        new Error("DB error"),
      );

      await expect(
        forgotPassword(testDependencies, {
          newPassword,
          token: dummyToken,
        }),
      ).rejects.toThrow("DB error");
    });

    it("should handle Redis cleanup failure but still return success", async () => {
      await testRedis.set(`forgot-password:${dummyHashedToken}`, dummyUserId);
      vi.spyOn(redisQueries, "deleteByKey").mockRejectedValue(
        new Error("Redis error"),
      );

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: dummyToken,
      });

      expect(result).toMatchObject({
        success: true,
        data: undefined,
      });

      const user = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUserId),
      });
      expect(await authUtils.verifyHash(newPassword, user!.password!)).toBe(
        true,
      );
    });

    it("should verify session invalidation and new session creation", async () => {
      await testRedis.set(`forgot-password:${dummyHashedToken}`, dummyUserId);

      const oldSessionId = "old-session-123";
      await testRedis.set(
        `session:${oldSessionId}`,
        JSON.stringify({
          user_id: dummyUserId,
          expires_at: Date.now() + 3600000,
        }),
      );
      await testRedis.sadd(`user_sessions:${dummyUserId}`, oldSessionId);

      const invalidateSpy = vi.spyOn(sessionService, "invalidateAllSessions");

      const result = await forgotPassword(testDependencies, {
        newPassword,
        token: dummyToken,
      });

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.anything(),
        dummyUserId,
      );

      const oldSession = await testRedis.get(`session:${oldSessionId}`);
      expect(oldSession).toBeNull();

      expect(result).toMatchObject({
        success: true,
        data: expect.any(Object),
      });
    });
  });

  describe("createAuthenticatedSessionResponse", () => {
    const dummyUser = {
      id: "session-user",
      email: "session@mail.com",
      isEmailVerified: true,
    };

    const dummyUserInfo: InsertUserInfo = {
      profile: {
        avatarUrl: "avatar",
        bio: "bio",
        username: "username",
      },
      preferences: {
        genres: ["g1", "g2", "g3"],
        authors: ["a"],
        series: ["s"],
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);
      await testDb.insert(userInfoTable).values({
        userId: dummyUser.id,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should create a session and return user info", async () => {
      const generateSessionTokenSpy = vi
        .spyOn(sessionService, "generateSessionToken")
        .mockReturnValue("token123");
      const createSessionSpy = vi.spyOn(sessionService, "createSession");
      const getUserInfoQuerySpy = vi.spyOn(userDbQueries, "getUserInfoQuery");

      const result = await createAuthenticatedSessionResponse(
        testDependencies,
        dummyUser.id,
      );

      expect(generateSessionTokenSpy).toHaveBeenCalledOnce();
      expect(createSessionSpy).toHaveBeenCalledOnce();
      expect(getUserInfoQuerySpy).toHaveBeenCalledOnce();

      expect(result).toMatchObject({
        token: "token123",
        expiresAt: expect.any(Date),
        user: {
          id: dummyUser.id,
          email: dummyUser.email,
          isEmailVerified: true,
          isOnboarded: false,
          userInfo: dummyUserInfo,
        },
      });

      const sessionId = authUtils.encodeToken("token123");
      const stored = await testRedis.get(`session:${sessionId}`);
      expect(stored).toBeTruthy();
    });

    it("should throw when user info is missing", async () => {
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);

      await expect(
        createAuthenticatedSessionResponse(testDependencies, dummyUser.id),
      ).rejects.toThrow(QueryExecutionError);
    });
  });

  describe("initOAuth", () => {
    const googleProvider = {
      createAuthorizationURL: vi
        .fn()
        .mockReturnValue(new URL("https://google.com/auth")),
    } as any;
    const amazonProvider = {
      createAuthorizationURL: vi
        .fn()
        .mockReturnValue(new URL("https://amazon.com/auth")),
    } as any;

    const deps = {
      ...testDependencies,
      providers: { google: googleProvider, amazon: amazonProvider },
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return auth url for google", async () => {
      const res = await initOAuth(deps, "google");

      expect(googleProvider.createAuthorizationURL).toHaveBeenCalledOnce();
      const args = googleProvider.createAuthorizationURL.mock.calls[0];
      expect(args[2]).toEqual(GOOGLE_SCOPES);

      expect(res).toMatchObject({
        success: true,
        data: {
          redirectUrl: "https://google.com/auth",
          state: expect.any(String),
          codeVerifier: expect.any(String),
        },
      });
    });

    it("should handle invalid provider", async () => {
      const res = await initOAuth(deps, "invalid" as any);
      expect(res).toMatchObject({
        success: false,
        error: { kind: "BAD_REQUEST", message: expect.any(String) },
      });
    });
  });

  describe("authenticateOAuthUser", () => {
    const claims = {
      iss: "http://issuer", // required
      aud: "client", // required
      exp: Math.floor(Date.now() / 1000) + 3600,
      sub: "provider-123",
      email: "oauth@test.com",
      email_verified: true,
      name: "Oauth User",
      picture: "https://example.com/avatar.png",
    };

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
    });

    it("should create new user when none exists", async () => {
      const spySession = vi.spyOn(
        authService,
        "createAuthenticatedSessionResponse",
      );

      const result = await authenticateOAuthUser(
        testDependencies,
        "google",
        claims,
      );

      expect(spySession).toHaveBeenCalledOnce();

      expect(result).toMatchObject({
        token: expect.any(String),
        expiresAt: expect.any(Date),
        user: {
          email: claims.email,
          isEmailVerified: true,
        },
      });

      const user = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.email, claims.email),
      });
      expect(user).toBeTruthy();

      const providerRow = await testDb.query.authProvidersTable.findFirst({
        where: eq(authProvidersTable.providerUserId, claims.sub),
      });
      expect(providerRow).toBeTruthy();
    });

    it("should link provider to existing user", async () => {
      const existingUser = await testDb
        .insert(usersTable)
        .values({
          id: "existing-id",
          email: claims.email,
          password: "", // unused
          isEmailVerified: true,
        })
        .returning();

      await testDb.insert(userInfoTable).values({
        userId: existingUser[0].id,
        avatarUrl: "",
        bio: null,
        username: "old",
        preferences: { genres: ["g1", "g2", "g3"] },
      });

      const spyCreateProvider = vi.spyOn(dbQueries, "createProvider");

      const res = await authenticateOAuthUser(testDependencies, "google", {
        ...claims,
        email: existingUser[0]?.email,
      });

      expect(spyCreateProvider).toHaveBeenCalledOnce();
      expect(res.user.id).toBe(existingUser[0].id);
    });
  });

  describe("oAuthCallback", () => {
    const googleProvider = {
      validateAuthorizationCode: vi.fn().mockResolvedValue({
        idToken: () => "id-token",
      }),
    } as any;

    const deps = {
      ...testDependencies,
      providers: { google: googleProvider, amazon: googleProvider },
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should authenticate and return session data", async () => {
      const claims = {
        iss: "http://issuer",
        aud: "client",
        exp: Math.floor(Date.now() / 1000) + 3600,
        sub: "123",
        email: "user@test.com",
        email_verified: true,
      };

      vi.spyOn(authService, "decodeIdToken").mockReturnValue(claims as any);

      const sessionData = {
        token: "tok",
        expiresAt: new Date(),
        user: {
          id: "id",
          email: claims.email,
          isEmailVerified: true,
          isOnboarded: false,
          userInfo: {
            profile: { avatarUrl: "", bio: null, username: "" },
            preferences: {},
          },
        },
      } as any;
      const authSpy = vi
        .spyOn(authService, "authenticateOAuthUser")
        .mockResolvedValue(sessionData);

      const res = await oAuthCallback(deps, {
        provider: "google",
        codeVerifier: "ver",
        code: "code",
      });

      expect(googleProvider.validateAuthorizationCode).toHaveBeenCalledOnce();
      expect(authService.decodeIdToken).toHaveBeenCalledOnce();
      expect(authSpy).toHaveBeenCalledWith(deps, "google", claims);

      expect(res).toMatchObject({ success: true, data: sessionData });
    });

    it("should return bad request for invalid provider", async () => {
      const res = await oAuthCallback(deps, {
        provider: "invalid" as any,
        codeVerifier: "v",
        code: "c",
      });

      expect(res).toMatchObject({
        success: false,
        error: { kind: "BAD_REQUEST", message: expect.any(String) },
      });
    });

    it("should handle authorization errors", async () => {
      googleProvider.validateAuthorizationCode.mockRejectedValue(
        new OAuth2RequestError("bad", "", "", ""),
      );

      const res = await oAuthCallback(deps, {
        provider: "google",
        codeVerifier: "v",
        code: "c",
      });

      expect(res).toMatchObject({
        success: false,
        error: { kind: "UNAUTHORIZED", message: expect.any(String) },
      });
    });
  });
});

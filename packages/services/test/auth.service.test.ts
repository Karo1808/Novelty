import { afterEach, describe, expect, it, vi } from "vitest";
import { registerUser, sendVerificationEmail } from "../auth.service";
import * as dbQueries from "@novelty/db/queries/auth.query";
import * as redisQueries from "@novelty/redis/queries/index.query";
import * as authUtils from "../lib/auth";
import * as tokenGenerationUtils from "@novelty/lib/generate-verification-token";
import * as email from "@novelty/email/client";
import { verify } from "@node-rs/argon2";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { eq, sql } from "drizzle-orm";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import {
  DatabaseConnectionError,
  QueryExecutionError,
} from "@novelty/db/lib/errors";
import { testDb, testDependencies, testRedis } from "../test-setup";
import { prepareDependencies } from "../lib/utils";
import { cleanup, render } from "@testing-library/react";
import { EmailDeliveryError } from "@novelty/email/error";
import {
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "../lib/config";

const dummyBody: InsertUser["register"] = {
  email: "email@mail.com",
  password: "password123",
};

describe("auth service", () => {
  describe("registerUser", () => {
    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
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
        email: expect.stringMatching(dummyBody.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const user = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.email, dummyBody.email),
      });
      expect(new Date(user!.createdAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(new Date(user!.updatedAt).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
      expect(user).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyBody.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Verify password hashing
      expect(await verify(user!.password, dummyBody.password)).toBe(true);
    });

    it("should handle email already existing", async () => {
      const getUserByEmailQuerySpy = vi.spyOn(dbQueries, "getUserByEmailQuery");
      const createUserQuerySpy = vi.spyOn(dbQueries, "createUserQuery");
      const hashPasswordSpy = vi.spyOn(authUtils, "hashPassword");

      await testDb.insert(usersTable).values({
        email: dummyBody.email,
        password: dummyBody.password,
      });

      const result = await registerUser(testDependencies, dummyBody);
      expect(getUserByEmailQuerySpy).toHaveBeenCalledOnce();
      expect(hashPasswordSpy).not.toHaveBeenCalled();
      expect(createUserQuerySpy).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        status: HttpStatusCodes.CONFLICT,
      });

      const users = await testDb.query.usersTable.findMany({
        where: eq(usersTable.email, dummyBody.email),
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

        // One of these should have succeeded and the other should return CONFLICT
        const statuses = [result1.status, result2.status];
        expect(statuses).toContain(HttpStatusCodes.CONFLICT);
        expect(statuses).toContain(HttpStatusCodes.CREATED);
      },
    );
  });

  describe("sendVerificationEmail", () => {
    const dummySenderEmail = "test@mail.com";
    const dummyToken = "12345";
    const dummyKey = `verify-email:${dummyBody.email}`;
    const dummyId = "resend-response-id";

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      cleanup();
    });

    it("should successfully complete all operations", async () => {
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      generateVerificationTokenSpy.mockReturnValue(dummyToken);

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const sendEmailSpy = vi
        .spyOn(email.emailClient.emails, "send")
        .mockResolvedValue({
          data: {
            id: dummyId,
          },
          error: null,
        });

      await registerUser(testDependencies, dummyBody);

      const result = await sendVerificationEmail(
        testDependencies,
        { email: dummyBody.email },
        dummySenderEmail,
      );

      expect(getIsEmailVerifiedQuerySpy).toHaveBeenCalledOnce();
      expect(getIsEmailVerifiedQuerySpy).toHaveResolvedWith({
        isEmailVerified: false,
      });

      expect(generateVerificationTokenSpy).toHaveBeenCalledOnce();
      expect(generateVerificationTokenSpy).toHaveBeenCalledWith(
        VERIFICATION_EMAIL_TOKEN_LENGTH,
      );
      expect(generateVerificationTokenSpy).toHaveReturnedWith(dummyToken);

      expect(setWithExpirySpy).toHaveBeenCalledOnce();
      expect(setWithExpirySpy).toHaveBeenCalledWith(
        prepareDependencies(testDependencies, "dbInstance"),
        dummyKey,
        dummyToken,
        VERIFICATION_EMAIL_EXPIRY_TIME,
      );
      expect(setWithExpirySpy).toHaveResolved();

      expect(sendEmailSpy).toHaveBeenCalledOnce();
      expect(sendEmailSpy).toHaveBeenCalledWith({
        from: dummySenderEmail,
        to: dummyBody.email,
        subject: "Email verification link",
        react: expect.anything(),
      });

      expect(result.status).toBe(HttpStatusCodes.OK);

      const redisToken = await testRedis.get(dummyKey);
      expect(redisToken).toBe(dummyToken);

      const ttl = await testRedis.ttl(dummyKey);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(VERIFICATION_EMAIL_EXPIRY_TIME);

      const emailComponent = sendEmailSpy?.mock?.calls?.[0]?.[0].react;

      const { getByText } = render(emailComponent);

      // Validate the rendered content
      expect(getByText(dummyToken)).toBeInTheDocument();
    });

    it("should handle user not found", async () => {
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const sendEmailSpy = vi.spyOn(email.emailClient.emails, "send");

      const result = await sendVerificationEmail(
        testDependencies,
        { email: dummyBody.email },
        dummySenderEmail,
      );

      expect(getIsEmailVerifiedQuerySpy).toHaveBeenCalledOnce();
      expect(getIsEmailVerifiedQuerySpy).toHaveResolvedWith(undefined);

      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(setWithExpirySpy).not.toHaveBeenCalled();
      expect(sendEmailSpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle user already verified", async () => {
      const getIsEmailVerifiedQuerySpy = vi.spyOn(
        dbQueries,
        "getIsEmailVerifiedQuery",
      );

      const generateVerificationTokenSpy = vi.spyOn(
        tokenGenerationUtils,
        "generateVerificationToken",
      );

      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      const sendEmailSpy = vi.spyOn(email.emailClient.emails, "send");

      await testDb.insert(usersTable).values({
        email: dummyBody.email,
        password: dummyBody.password,
        isEmailVerified: true,
      });

      const result = await sendVerificationEmail(
        testDependencies,
        { email: dummyBody.email },
        dummySenderEmail,
      );

      expect(getIsEmailVerifiedQuerySpy).toHaveBeenCalledOnce();
      expect(getIsEmailVerifiedQuerySpy).toHaveResolvedWith({
        isEmailVerified: true,
      });

      expect(generateVerificationTokenSpy).not.toHaveBeenCalled();
      expect(setWithExpirySpy).not.toHaveBeenCalled();
      expect(sendEmailSpy).not.toHaveBeenCalled();

      expect(result.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should handle error when sending email", async () => {
      const setWithExpirySpy = vi.spyOn(redisQueries, "setWithExpiry");

      vi.spyOn(email.emailClient.emails, "send").mockResolvedValueOnce({
        error: {
          message: "Sending email error",
          name: "internal_server_error",
        },
        data: null,
      });

      await registerUser(testDependencies, dummyBody);

      await expect(
        sendVerificationEmail(
          testDependencies,
          { email: dummyBody.email },
          dummySenderEmail,
        ),
      ).rejects.toThrow(new EmailDeliveryError("Sending email error"));

      expect(setWithExpirySpy).not.toHaveBeenCalled();
    });
  });
});

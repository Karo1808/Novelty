import { insertUserSchema, usersTable } from "@novelty/db/schemas/user.schema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import env from "@/env";
import * as email from "@novelty/email/client";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { authRouter } from "../auth.index";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import createErrorSchema from "@/lib/create-error-schema";
import type { z } from "zod";
import * as queries from "@novelty/db/queries/auth.query";
import * as authServices from "@novelty/services/auth.service";
import { DatabaseConnectionError } from "@novelty/db/lib/errors";
import {
  testDb,
  testDependencies,
  testQueue,
  testRedis,
  testRedlock,
} from "@/test-setup";
import { testClient } from "hono/testing";
import { eq, sql } from "drizzle-orm";
import { forgotPasswordBodySchema } from "@novelty/lib/validations/auth";
import type { VerifyEmailBodySchema } from "@novelty/lib/validations/auth";
import * as authUtils from "@novelty/lib/auth/cryptography";
import * as queueUtils from "@novelty/message-queue/lib/add-job-to-queue";
import * as sessionService from "@novelty/services/session.service";
import type { InsertUserInfo } from "@novelty/db/schemas/user-info.schema";
import { userInfoTable } from "@novelty/db/schemas/user-info.schema";

vi.mock("@hono/node-server/conninfo", () => ({
  getConnInfo: vi.fn(() => ({
    remote: {
      address: "127.0.0.1",
    },
  })),
}));

vi.mock("@novelty/db/index", () => ({
  get db() {
    return testDb;
  },
}));

vi.mock("@novelty/redis/index", () => ({
  get redis() {
    return testRedis;
  },
  get redlock() {
    return testRedlock;
  },
}));

vi.mock("@novelty/message-queue/queues/email.queue", () => ({
  get emailQueue() {
    return testQueue;
  },
}));

vi.mock("@/middleware/rate-limit.ts", () => ({
  emailVerificationLimiter: vi.fn((c, next) => next()),
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", authRouter));

describe("auth routes", () => {
  describe("post /register", () => {
    const dummyBody: InsertUser["register"] = {
      email: "email@mail.com",
      password: "password123",
    };

    afterEach(async () => {
      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyBody.email));
      vi.clearAllMocks();
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testQueue.obliterate();
    });

    it("handles success", async () => {
      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/registration success/i),
        user: {
          id: expect.stringMatching(/^[\w-]{21}$/),
          email: expect.stringMatching(dummyBody.email),
          isEmailVerified: false,
          createdAt: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ),
          updatedAt: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ),
        },
      });
    });

    it("returns conflict if email already exists", async () => {
      await testDb.insert(usersTable).values({
        email: dummyBody.email,
        password: "somehashedpassword",
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/already exists/i),
      });
    });

    it("returns bad request if request body is invalid", async () => {
      const invalidBody = { email: "newuser", password: "password" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.register);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth.register.$post({
        json: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns service unavailable if database connection fails", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(authServices, "registerUser").mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

      const response = await client.auth.register.$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("post /send-verification-email", () => {
    const dummyBody: InsertUser["sendEmail"] = {
      email: "email@mail.com",
    };

    const dummyUser: InsertUser["register"] = {
      email: "email@mail.com",
      password: "password",
    };

    const dummyId = "resend-response-id";

    beforeEach(async () => {
      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyBody.email!));
      await testDb.insert(usersTable).values(dummyUser);
      vi.clearAllMocks();
    });

    afterEach(async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
    });

    it("handles success", async () => {
      vi.spyOn(email.emailClient.emails, "send").mockResolvedValue({
        data: {
          id: dummyId,
        },
        error: null,
      });

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/email sent/i),
        success: true,
      });
    });

    it("returns ok if email does not exist", async () => {
      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyBody.email!));

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/email sent/i),
        success: true,
      });
    });

    it("returns ok if email is already verified", async () => {
      await testDb
        .update(usersTable)
        .set({ isEmailVerified: true, ...dummyBody });

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/email sent/i),
        success: true,
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = { email: "newuser" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.sendEmail);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth["send-verification-email"].$post({
        json: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns service unavailable if database connection fails", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(authServices, "sendVerificationEmail").mockImplementationOnce(
        () => {
          throw new Error("Unexpected error");
        },
      );

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles concurrent requests correctly", async () => {
      const concurrencyLevel = 3;
      const delayMs = 3000;
      const requests: Promise<Response>[] = [];

      const originalAddJobToQueue = queueUtils.addJobToQueue;

      vi.spyOn(queueUtils, "addJobToQueue").mockImplementation(
        async (...args) => {
          await new Promise(res => setTimeout(res, delayMs));
          return originalAddJobToQueue(...args);
        },
      );

      for (let i = 0; i < concurrencyLevel; i++) {
        requests.push(
          client.auth["send-verification-email"].$post({
            json: dummyBody,
          }),
        );
      }

      const results = await Promise.allSettled(requests);

      let successCount = 0;
      let conflictOrLockFailureCount = 0;

      for (const result of results) {
        if (result.status === "fulfilled") {
          const response = result.value;
          if (response.status === HttpStatusCodes.OK) {
            successCount++;
          }
          else {
            if (
              response.status !== HttpStatusCodes.CONFLICT
              && response.status !== HttpStatusCodes.TOO_MANY_REQUESTS
              && response.status !== HttpStatusCodes.SERVICE_UNAVAILABLE
            ) {
              console.warn(
                `Unexpected status ${response.status} in concurrency test.`,
              );
            }
            conflictOrLockFailureCount++;
          }
        }
        else {
          console.error("Request rejected in concurrency test:", result.reason);
          conflictOrLockFailureCount++;
        }
      }

      expect(successCount).toBe(1);

      expect(conflictOrLockFailureCount).toBe(concurrencyLevel - 1);
    });
  });

  describe("post /verify-email", () => {
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
      vi.spyOn(authUtils, "decryptString").mockReturnValue(dummyUser.id);
      await testDb.insert(usersTable).values(dummyUser);
      await testRedis.set(dummyKey, dummyToken);
    });

    afterEach(async () => {
      await testRedis.flushall();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      vi.clearAllMocks();
    });

    it("handles success", async () => {
      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/email verified/i),
        success: true,
      });
    });

    it("returns not found if user does not exist", async () => {
      await testDb.delete(usersTable).where(eq(usersTable.id, dummyUser.id));

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/not exist/i),
        success: false,
      });
    });

    it("returns bad request if the code is invalid", async () => {
      await testRedis.del(dummyKey);

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/\b(?:code|invalid|expire)\b/g),
        success: false,
      });
    });

    it("returns conflict if email is already verified", async () => {
      await testDb
        .update(usersTable)
        .set({ isEmailVerified: true, ...dummyBody });

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);
      const json = await response.json();

      expect(json).toMatchObject({
        success: false,
        message: expect.stringMatching(/already verified/i),
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = { verificationCode: 123, encryptedUserId: "test" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.sendEmail);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth["verify-email"].$post({
        // @ts-expect-error simulating incorrect body required in this case
        json: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns service unavailable if database connection fails", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("post /login", async () => {
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
    let dummyPassword: string = "password";

    dummyPassword = await authUtils.hashString(dummyPassword);

    const dummyUser = {
      id: "dummy-id",
      email: "email@mail.com",
      password: dummyPassword,
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
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testRedis.flushall();
      vi.restoreAllMocks();
    });

    it("handles success", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: dummyUser.email,
          password: "password",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.headers.has("set-cookie")).toBe(true);
    });

    it("handles invalid email (validation error)", async () => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.login);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth.login.$post({
        json: {
          email: "invalid-email",
          password: "password123",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("handles invalid password", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: "test@example.com",
          password: "wrongPassword",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles user not found", async () => {
      const response = await client.auth.login.$post({
        json: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles user blacklisted", async () => {
      const blacklistKey = `blacklist`;
      await testRedis.hset(blacklistKey, dummyUser.id, "true");

      const response = await client.auth.login.$post({
        json: {
          email: dummyUser.email,
          password: "password123",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);

      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles service unavailable (user service error)", async () => {
      vi.spyOn(queries, "getUserByEmailQuery").mockRejectedValue(
        new Error("DB error"),
      );

      const response = await client.auth.login.$post({
        json: {
          email: "test@example.com",
          password: "password123",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("post /auth/send-forgot-password-email", () => {
    const dummyEmail = "test@example.com";
    const dummyId = "dummy-id";

    beforeEach(async () => {
      vi.restoreAllMocks();
      await testDb
        .insert(usersTable)
        .values({ email: dummyEmail, password: "hashedpassword", id: dummyId });
    });

    afterEach(async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
    });

    it("should return 204 No Content for valid request (user exists)", async () => {
      const response = await client.auth["send-forgot-password-email"].$post({
        json: { email: dummyEmail },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("should return 204 No Content even if user not found (security measure)", async () => {
      const nonExistentEmail = "non@mail.com";

      const response = await client.auth["send-forgot-password-email"].$post({
        json: { email: nonExistentEmail },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("should return 503 Service Unavailable for database connection failure", async () => {
      const dummyEmail = "test-db-fail@example.com";
      vi.spyOn(queries, "getUserByEmailQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.auth["send-forgot-password-email"].$post({
        json: { email: dummyEmail },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("should return 422 Unprocessable Entity for invalid email format", async () => {
      const invalidEmail = "invalid-email";
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(insertUserSchema.shape.sendEmail);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth["send-forgot-password-email"].$post({
        json: { email: invalidEmail },
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;
      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("handles user blacklisted", async () => {
      const blacklistKey = `blacklist`;
      await testRedis.hset(blacklistKey, dummyId, "true");

      const response = await client.auth["send-forgot-password-email"].$post({
        json: {
          email: dummyEmail,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);

      const json = await response.json();
      expect(json).toHaveProperty("message");
      await testRedis.flushdb();
    });

    it("should return 500 Internal Server Error for unexpected errors", async () => {
      const dummyEmail = "test-server-error@example.com";

      vi.spyOn(authServices, "sendForgotPasswordEmail").mockImplementationOnce(
        () => {
          throw new Error("Unexpected service error");
        },
      );

      const response = await client.auth["send-forgot-password-email"].$post({
        json: { email: dummyEmail },
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles concurrent requests correctly", async () => {
      const concurrencyLevel = 3;
      const delayMs = 3000;
      const requests: Promise<Response>[] = [];

      const originalAddJobToQueue = queueUtils.addJobToQueue;

      vi.spyOn(queueUtils, "addJobToQueue").mockImplementation(
        async (...args) => {
          await new Promise(res => setTimeout(res, delayMs));
          return originalAddJobToQueue(...args);
        },
      );

      for (let i = 0; i < concurrencyLevel; i++) {
        requests.push(
          client.auth["send-forgot-password-email"].$post({
            json: {
              email: dummyEmail,
            },
          }),
        );
      }

      const results = await Promise.allSettled(requests);

      let successCount = 0;
      let conflictOrLockFailureCount = 0;

      for (const result of results) {
        if (result.status === "fulfilled") {
          const response = result.value;
          if (response.status === HttpStatusCodes.OK) {
            successCount++;
          }
          else {
            if (
              response.status !== HttpStatusCodes.CONFLICT
              && response.status !== HttpStatusCodes.TOO_MANY_REQUESTS
              && response.status !== HttpStatusCodes.SERVICE_UNAVAILABLE
            ) {
              console.warn(
                `Unexpected status ${response.status} in concurrency test.`,
              );
            }
            conflictOrLockFailureCount++;
          }
        }
        else {
          console.error("Request rejected in concurrency test:", result.reason);
          conflictOrLockFailureCount++;
        }
      }

      expect(successCount).toBe(1);

      expect(conflictOrLockFailureCount).toBe(concurrencyLevel - 1);
    });
  });

  describe("post /forgot-password", () => {
    const dummyUser = {
      id: "dummy-user-id",
      email: "forgot@mail.com",
      password: "oldPassword123", // This will be hashed in beforeEach
      isEmailVerified: true,
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: ["fantasy", "sci-fi", "comedy"],
        authors: ["author"],
        series: ["series"],
      },
      profile: {
        avatarUrl: "url",
        bio: "bio",
        username: "username",
      },
    };

    const dummyToken = "valid-reset-token"; // This is the raw token sent to the user
    const dummyNewPassword = "newPassword123";
    let hashedToken = authUtils.encodeToken(dummyToken); // Hashed token stored in Redis key
    let redisKey = `forgot-password:${hashedToken}`; // Redis key: forgot-password:<hashedToken>
    let originalHashedPassword = "";

    beforeEach(async () => {
      originalHashedPassword = await authUtils.hashString(dummyUser.password);
      hashedToken = authUtils.encodeToken(dummyToken);
      redisKey = `forgot-password:${hashedToken}`;

      await testDb
        .insert(usersTable)
        .values({
          ...dummyUser,
          password: originalHashedPassword,
        })
        .onConflictDoNothing();

      await testDb.insert(userInfoTable).values({
        userId: dummyUser.id,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });

      await testRedis.set(redisKey, dummyUser.id);
      vi.restoreAllMocks();
    });

    afterEach(async () => {
      await testRedis.flushall();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
    });

    it("handles success", async () => {
      const response = await client.auth["forgot-password"].$post({
        json: {
          token: dummyToken,
          newPassword: dummyNewPassword,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.headers.has("set-cookie")).toBe(true);
    });

    it("returns bad request if user associated with token does not exist", async () => {
      await testDb.delete(usersTable).where(eq(usersTable.id, dummyUser.id));

      const response = await client.auth["forgot-password"].$post({
        json: {
          token: dummyToken,
          newPassword: dummyNewPassword,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/invalid|expired|token/i),
      });
    });

    it("returns bad request if token is invalid or expired", async () => {
      const invalidTokenResponse = await client.auth["forgot-password"].$post({
        json: {
          token: "invalid-token-format",
          newPassword: dummyNewPassword,
        },
      });

      expect(invalidTokenResponse.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const json = await invalidTokenResponse.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/invalid|expired|token/i),
      });
    });

    it("returns unprocessable entity if request body is invalid (e.g., short password)", async () => {
      const invalidPassword = "";

      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(forgotPasswordBodySchema);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.auth["forgot-password"].$post({
        json: {
          token: dummyToken,
          newPassword: invalidPassword,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;
      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns service unavailable if database connection fails during password update", async () => {
      vi.spyOn(queries, "updateUserByIdQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError(
          "Simulated DB connection failure during update",
        );
      });

      const response = await client.auth["forgot-password"].$post({
        json: {
          token: dummyToken,
          newPassword: dummyNewPassword,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");

      const userCheck = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUser.id),
      });
      expect(userCheck!.password).toBe(originalHashedPassword);

      const tokenExists = await testRedis.exists(redisKey);
      expect(tokenExists).toBe(1);
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(authUtils, "encodeToken").mockImplementationOnce(() => {
        throw new Error("Simulated unexpected error");
      });

      const response = await client.auth["forgot-password"].$post({
        json: {
          token: dummyToken,
          newPassword: dummyNewPassword,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("handles concurrent requests correctly", async () => {
      const concurrencyLevel = 3;
      const delayMs = 3000;
      const requests: Promise<Response>[] = [];

      const originalAddJobToQueue = queueUtils.addJobToQueue;

      vi.spyOn(queueUtils, "addJobToQueue").mockImplementation(
        async (...args) => {
          await new Promise(res => setTimeout(res, delayMs));
          return originalAddJobToQueue(...args);
        },
      );

      for (let i = 0; i < concurrencyLevel; i++) {
        requests.push(
          client.auth["forgot-password"].$post({
            json: {
              token: dummyToken,
              newPassword: dummyNewPassword,
            },
          }),
        );
      }

      const results = await Promise.allSettled(requests);

      let successCount = 0;
      let conflictOrLockFailureCount = 0;

      for (const result of results) {
        if (result.status === "fulfilled") {
          const response = result.value;
          if (response.status === HttpStatusCodes.OK) {
            successCount++;
          }
          else {
            if (
              response.status !== HttpStatusCodes.CONFLICT
              && response.status !== HttpStatusCodes.TOO_MANY_REQUESTS
              && response.status !== HttpStatusCodes.SERVICE_UNAVAILABLE
            ) {
              console.warn(
                `Unexpected status ${response.status} in concurrency test.`,
              );
            }
            conflictOrLockFailureCount++;
          }
        }
        else {
          console.error("Request rejected in concurrency test:", result.reason);
          conflictOrLockFailureCount++;
        }
      }

      expect(successCount).toBe(1);

      expect(conflictOrLockFailureCount).toBe(concurrencyLevel - 1);
    });
  });

  describe("post /logout", () => {
    const dummySessionToken = "session123";
    const dummyUserId = "user123";

    beforeEach(async () => {
      await sessionService.createSession(
        {
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          redisClient: testRedis,
          reqId: testDependencies.reqId,
        },
        dummySessionToken,
        dummyUserId,
      );
      vi.clearAllMocks();
    });

    afterEach(async () => {
      testRedis.flushall();
    });

    it("handles success", async () => {
      const response = await client.auth.logout.$post({
        header: {
          cookie: `session=${dummySessionToken}`,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const header = response.headers.get("Set-Cookie");
      expect(header).toMatch(/session=;/);
    });

    it("returns unauthorized for invalid session cookie", async () => {
      const response = await client.auth.logout.$post({
        header: {
          cookie: `session=invalidSession;`,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/unauthorized/i),
      });
    });

    it("returns service unavailable if database connection fails", async () => {
      vi.spyOn(sessionService, "invalidateSession").mockImplementationOnce(
        () => {
          throw new DatabaseConnectionError("Database connection failed");
        },
      );

      const response = await client.auth.logout.$post({
        header: {
          cookie: `session=${dummySessionToken}`,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(sessionService, "invalidateSession").mockImplementationOnce(
        () => {
          throw new Error("Unexpected error");
        },
      );

      const response = await client.auth.logout.$post({
        header: {
          cookie: `session=${dummySessionToken}`,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("get /oauth/:provider", () => {
    const dummyData = {
      redirectUrl: "https://provider.com/auth",
      state: "state123",
      codeVerifier: "verifier123",
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("handles success", async () => {
      vi.spyOn(authServices, "initOAuth").mockResolvedValueOnce({
        success: true,
        data: dummyData,
      });

      const response = await client.auth.oauth[":provider"].$get({
        param: { provider: "google" },
      });

      expect(response.status).toBe(HttpStatusCodes.FOUND);
      expect(response.headers.get("location")).toBe(dummyData.redirectUrl);
      const cookie = response.headers.get("set-cookie") ?? "";
      expect(cookie).toContain("state=");
    });

    it("returns bad request for invalid provider", async () => {
      const response = await client.auth.oauth[":provider"].$get({
        param: { provider: "invalid" as any },
      });

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });

  describe("get /oauth/:provider/callback", () => {
    const dummySession = {
      token: "sessiontoken",
      expiresAt: new Date(),
      user: {
        id: "id",
        email: "mail@mail.com",
        isEmailVerified: true,
        isOnboarded: false,
        userInfo: { profile: { avatarUrl: "", bio: null, username: "" }, preferences: {} },
      },
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("handles success", async () => {
      vi.spyOn(authServices, "oAuthCallback").mockResolvedValueOnce({
        success: true,
        data: dummySession,
      });

      const response = await client.auth.oauth[":provider"].callback.$get({
        param: { provider: "google" },
        query: { state: "s", code: "c" },
        header: { cookie: "state=s; code_verifier=v" },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);
      const json = await response.json();
      expect(json).toHaveProperty("user");
      expect(response.headers.has("set-cookie")).toBe(true);
    });

    it("returns unauthorized when provider rejects code", async () => {
      vi.spyOn(authServices, "oAuthCallback").mockResolvedValueOnce({
        success: false,
        error: { kind: "UNAUTHORIZED", message: "invalid" },
      });

      const response = await client.auth.oauth[":provider"].callback.$get({
        param: { provider: "google" },
        query: { state: "s", code: "c" },
        header: { cookie: "state=s; code_verifier=v" },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns bad request for invalid provider", async () => {
      const response = await client.auth.oauth[":provider"].callback.$get({
        param: { provider: "invalid" as any },
        query: { state: "s", code: "c" },
        header: { cookie: "state=s; code_verifier=v" },
      });

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });
});

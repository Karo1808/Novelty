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
import { testDb, testQueue, testRedis } from "@/test-setup";
import { testClient } from "hono/testing";
import { eq, sql } from "drizzle-orm";
import type { VerifyEmailBodySchema } from "@novelty/lib/validations/auth";
import * as authUtils from "@novelty/lib/auth/cryptography";
import * as sessionService from "@novelty/services/session.service";

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

    it("handles concurrent requests correctly", async () => {
      const numberOfRequests = 10;

      const requests = Array.from({ length: numberOfRequests }).map(() =>
        client.auth.register.$post({ json: dummyBody }),
      );

      const responses = await Promise.all(requests);

      const successResponses = responses.filter(
        res => res.status === HttpStatusCodes.CREATED,
      );
      expect(successResponses).toHaveLength(1);

      const conflictResponses = responses.filter(
        res => res.status === HttpStatusCodes.CONFLICT,
      );
      expect(conflictResponses).toHaveLength(numberOfRequests - 1);
    });
  });

  describe("post /send-verification-email", () => {
    const dummyBody: InsertUser["sendVerificationEmail"] = {
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
        .where(eq(usersTable.email, dummyBody.email));
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

    it("returns not found if email does not exist", async () => {
      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyBody.email));

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/not exist/i),
        success: false,
      });
    });

    it("returns conflict if email is already verified", async () => {
      await testDb
        .update(usersTable)
        .set({ isEmailVerified: true, ...dummyBody });

      const response = await client.auth["send-verification-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);
      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/verified/i),
        success: false,
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = { email: "newuser" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(
        insertUserSchema.shape.sendVerificationEmail,
      );
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
      const numberOfRequests = 3;

      const requests = Array.from({ length: numberOfRequests }).map(() =>
        client.auth["send-verification-email"].$post({ json: dummyBody }),
      );

      const responses = await Promise.all(requests);

      const successResponses = responses.filter(
        res => res.status === HttpStatusCodes.OK,
      );
      expect(successResponses).toHaveLength(1);

      const conflictResponses = responses.filter(
        res => res.status === HttpStatusCodes.CONFLICT,
      );

      const conflictJson = await conflictResponses[0]?.json();

      expect(conflictJson?.message).toMatch(/another process/i);

      expect(conflictResponses).toHaveLength(numberOfRequests - 1);
    });
  });

  describe("post /verify-email", () => {
    const dummyUser = {
      id: "dummy-id",
      email: "email@mail.com",
      password: "password123",
    };

    const dummyKey = `verify-email:${dummyUser.id}`;
    const dummyToken = "12345";

    const dummyBody: VerifyEmailBodySchema = {
      encryptedUserId: dummyUser.id,
      verificationCode: dummyToken,
    };

    const dummySessionToken = "session123";

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
      vi.spyOn(sessionService, "generateSessionToken").mockReturnValue(
        dummySessionToken,
      );

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const json = await response.json();

      expect(json).toMatchObject({
        message: expect.stringMatching(/email verified/i),
        success: true,
      });

      const header = response.headers.get("Set-Cookie");
      const [_, sessionId] = header!.split(";")[0]!.split("=");

      expect(sessionId).toBe(dummySessionToken);
    });

    it("returns not found if user does not exist", async () => {
      await testDb.delete(usersTable).where(eq(usersTable.id, dummyUser.id));

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      const json = await response.json();
      expect(json).toMatchObject({
        message: expect.stringMatching(/not found/i),
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
        message: expect.stringMatching(/verified/i),
        success: false,
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = { verificationCode: 123, encryptedUserId: "test" };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(
        insertUserSchema.shape.sendVerificationEmail,
      );
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
      vi.spyOn(queries, "getIsEmailVerifiedQuery").mockImplementationOnce(
        () => {
          throw new DatabaseConnectionError("Database connection failed");
        },
      );

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });

    it("returns internal server error on unexpected error", async () => {
      vi.spyOn(authUtils, "decryptString").mockImplementationOnce(() => {
        throw new Error("Unexpected error");
      });

      const response = await client.auth["verify-email"].$post({
        json: dummyBody,
      });

      expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      const json = await response.json();
      expect(json).toHaveProperty("message");
    });
  });
});

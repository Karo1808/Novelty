import env from "@/env";
import { testDb, testDependencies, testRedis, testS3 } from "@/test-setup";
import { userInfoTable } from "@novelty/db/schemas/user-info.schema";
import type { InsertUserInfo } from "@novelty/db/schemas/user-info.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import { sql } from "drizzle-orm";
import { testClient } from "hono/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRouter } from "../user.index";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { createSession } from "@novelty/services/session.service";
import { userProfilesTable } from "@novelty/db/schemas/index.schema";
import * as userDbQueries from "@novelty/db/queries/user.query";
import * as authDbQueries from "@novelty/db/queries/auth.query";
import * as serviceUtils from "@novelty/services/lib/utils";
import { DatabaseConnectionError } from "@novelty/db/lib/errors";
import { Blob } from "fetch-blob";
import { Buffer } from "node:buffer";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import createErrorSchema from "@/lib/create-error-schema";
import type { z } from "zod";

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

vi.mock("@novelty/lib/s3-client", () => ({
  get s3Client() {
    return testS3;
  },
}));

vi.mock("@/middleware/rate-limit.ts", () => ({
  mainLimiter: vi.fn((c, next) => next()),
  emailVerificationLimiter: vi.fn((c, next) => next()),
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const dummyUser = {
  email: "mail@email.com",
  password: "password123",
  id: "123",
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

const client = testClient(createApp().route("/", userRouter));

describe("user routes", () => {
  let dummyCookie: string;

  beforeEach(async () => {
    await testDb.insert(usersTable).values(dummyUser);
    await testDb.insert(userInfoTable).values({
      userId: dummyUser.id,
      avatarUrl: dummyUserInfo.profile.avatarUrl,
      bio: dummyUserInfo.profile.bio,
      username: dummyUserInfo.profile.username,
      preferences: dummyUserInfo.preferences,
    });

    const dummySessionToken = "dummy-token";

    await createSession(
      {
        logger: testDependencies.logger,
        prometheusRegistry: testDependencies.prometheusRegistry,
        redisClient: testRedis,
        reqId: testDependencies.reqId,
      },
      dummySessionToken,
      dummyUser.id,
    );

    dummyCookie = [
      `session=${dummySessionToken}`,
      "HttpOnly",
      "SameSite=Lax",
      "Path=/",
      `Max-Age=${1000}`,
    ]
      .filter(Boolean)
      .join("; ");
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await testDb.execute(sql`TRUNCATE table users CASCADE`);
    await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
  });

  describe("get /user/profile", async () => {
    it("should handle success", async () => {
      const response = await client.user.profile.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const profileData = await response.json();

      expect(profileData).toEqual({ userInfo: dummyUserInfo.profile });
    });

    it("should handle not found", async () => {
      await testDb.delete(userProfilesTable);

      const response = await client.user.profile.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle not authorized", async () => {
      const response = await client.user.profile.$get({
        header: { cookie: "invalid-cookie" },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle service unavailable", async () => {
      vi.spyOn(userDbQueries, "getProfileByUserIdQuery").mockImplementationOnce(
        () => {
          throw new DatabaseConnectionError("Database connection failed");
        },
      );

      const response = await client.user.profile.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

      const profileData = await response.json();
      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });
  });

  describe("patch /user/profile", async () => {
    const dummyFile = new Blob([Buffer.from("fake image data")], {
      type: "image/jpg",
    });

    const bucketName = env.R2_BUCKET_NAME;

    const dummyPayload = {
      bio: dummyUserInfo.profile.bio,
      username: dummyUserInfo.profile.username,
      profileImage: dummyFile,
    };

    const dummyKey = `profile_pictures/${dummyUser.id}.jpg`;

    beforeEach(() => {
      vi.spyOn(serviceUtils, "getOldKey").mockReturnValue(dummyKey);
    });

    afterEach(async () => {
      await testS3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: dummyKey,
        }),
      );
    });

    it("should handle success", async () => {
      const response = await client.user.profile.$patch({
        form: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle not found", async () => {
      await testDb.delete(usersTable);

      const response = await client.user.profile.$patch({
        form: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle conflict", async () => {
      await testDb.insert(usersTable).values({
        isEmailVerified: true,
        id: "1234",
        email: "dummy@mail.com",
        password: "pass",
      });

      await testDb.insert(userInfoTable).values({
        username: "new-user",
        userId: "1234",
      });

      const response = await client.user.profile.$patch({
        form: { ...dummyPayload, username: "new-user" },
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle not authorized", async () => {
      const response = await client.user.profile.$patch({
        header: { cookie: "invalid-cookie" },
        form: {},
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = {
        bio: "",
        username: "us", // username must be at least 4 characters
        profileImage: dummyFile,
      };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(serviceUtils.updateProfileSchema);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.user.profile.$patch({
        header: { cookie: dummyCookie },
        form: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("returns unprocessable entity if file type is invalid", async () => {
      const invalidFile = new Blob([Buffer.from("fake image data")], {
        type: ".pdf",
      });

      const invalidBody = {
        bio: "",
        username: "username",
        profileImage: invalidFile,
      };

      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(serviceUtils.updateProfileSchema);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.user.profile.$patch({
        header: { cookie: dummyCookie },
        form: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json.error.issues[0]?.message).toMatch(/Invalid image file type/i);

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("should handle service unavailable", async () => {
      vi.spyOn(authDbQueries, "getUserByIdQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.user.profile.$patch({
        form: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

      const profileData = await response.json();
      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });
  });

  describe("get /user/preferences", async () => {
    it("should handle success", async () => {
      const response = await client.user.preferences.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const profileData = await response.json();

      expect(profileData).toEqual({
        userPreferences: dummyUserInfo.preferences,
      });
    });

    it("should handle not found", async () => {
      await testDb.delete(userProfilesTable);

      const response = await client.user.preferences.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle not authorized", async () => {
      const response = await client.user.preferences.$get({
        header: { cookie: "invalid-cookie" },
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle service unavailable", async () => {
      vi.spyOn(
        userDbQueries,
        "getPreferencesByUserIdQuery",
      ).mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.user.preferences.$get({
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

      const profileData = await response.json();
      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });
  });

  describe("patch /user/preferences", async () => {
    const dummyPayload = dummyUserInfo.preferences;

    it("should handle success", async () => {
      const response = await client.user.preferences.$patch({
        json: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle not found", async () => {
      await testDb.delete(usersTable);

      const response = await client.user.preferences.$patch({
        json: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should handle not authorized", async () => {
      const response = await client.user.preferences.$patch({
        header: { cookie: "invalid-cookie" },
        json: dummyPayload,
      });

      expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);

      const profileData = await response.json();

      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });

    it("returns unprocessable entity if request body is invalid", async () => {
      const invalidBody = {
        genres: [""],
        authors: 1,
      };
      // eslint-disable-next-line unused-imports/no-unused-vars
      const errorSchema = createErrorSchema(serviceUtils.updateProfileSchema);
      type ValidationError = z.infer<typeof errorSchema>;

      const response = await client.user.preferences.$patch({
        header: { cookie: dummyCookie },
        // @ts-expect-error simulate zod error
        json: invalidBody,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = (await response.json()) as ValidationError;

      expect(json).toHaveProperty("error");
      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });

    it("should handle service unavailable", async () => {
      vi.spyOn(authDbQueries, "getUserByIdQuery").mockImplementationOnce(() => {
        throw new DatabaseConnectionError("Database connection failed");
      });

      const response = await client.user.preferences.$patch({
        json: dummyPayload,
        header: { cookie: dummyCookie },
      });

      expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

      const profileData = await response.json();
      expect(profileData).toMatchObject({
        message: expect.any(String),
      });
    });
  });
});

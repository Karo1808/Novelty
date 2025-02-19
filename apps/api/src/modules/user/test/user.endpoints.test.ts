import env from "@/env";
import { testDb, testDependencies, testRedis } from "@/test-setup";
import { userInfoTable } from "@novelty/db/schemas/user-profile.schema";
import type { InsertUserInfo } from "@novelty/db/schemas/user-profile.schema";
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
import { DatabaseConnectionError } from "@novelty/db/lib/errors";

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
    genres: [],
    authors: [],
    series: [],
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

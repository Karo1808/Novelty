import { testClient } from "hono/testing";
import type { Pool as TPool } from "pg";
import { describe, expect, it, vi } from "vitest";
import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { healthcheckRouter } from "../healthcheck.index";
import { drizzle } from "drizzle-orm/node-postgres";
import { Redis } from "ioredis";
import { testDb, testRedis } from "@/test-setup";

vi.mock("@hono/node-server/conninfo", () => ({
  getConnInfo: vi.fn(() => ({
    remote: {
      address: "127.0.0.1",
    },
  })),
}));

let dbClient: any;

vi.mock("@novelty/db/index", () => ({
  get db() {
    return dbClient;
  },
}));

let redis: any;

vi.mock("@novelty/redis/index", () => ({
  get redis() {
    return redis;
  },
}));

vi.mock("@/middleware/rate-limit.ts", () => ({
  mainLimiter: vi.fn(),
  emailVerificationLimiter: vi.fn(),
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", healthcheckRouter));

describe("healthcheck routes", () => {
  it("get /healthcheck handles service available", async () => {
    dbClient = testDb;
    redis = testRedis;

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.OK);

    const json = await response.json();
    expect(json.status).toMatch(/healthy/i);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("connected");
    expect(json.readiness.redis).toBe("connected");
  });

  it("get /healthcheck handles both services unavailable", async () => {
    dbClient = drizzle({ client: "" as unknown as TPool });
    redis = new Redis({
      port: 0,
      retryStrategy: () => {},
    });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
    expect(json.readiness.redis).toBe("disconnected");
  });

  it("get /healthcheck handles database service unavailable", async () => {
    dbClient = drizzle({ client: "" as unknown as TPool });
    redis = testRedis;

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
    expect(json.readiness.redis).toBe("connected");
  });

  it("get /healthcheck handles redis service unavailable", async () => {
    dbClient = testDb;
    redis = new Redis({
      port: 0,
      retryStrategy: () => {},
    });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("connected");
    expect(json.readiness.redis).toBe("disconnected");
  });
});

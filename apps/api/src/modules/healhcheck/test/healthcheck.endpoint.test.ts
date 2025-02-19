import { testClient } from "hono/testing";
import type { Pool as TPool } from "pg";
import { describe, expect, it, vi } from "vitest";
import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { healthcheckRouter } from "../healthcheck.index";
import { drizzle } from "drizzle-orm/node-postgres";
import { Redis } from "ioredis";
import { testDb, testQueue, testRedis } from "@/test-setup";
import { createQueue } from "@novelty/message-queue/lib/create-queue";
import { redisConfig } from "@novelty/message-queue/config";

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

let emailQueue: any;

vi.mock("@novelty/message-queue/queues/email.queue", () => ({
  get emailQueue() {
    return emailQueue;
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
  it("get /healthcheck handles all service available", async () => {
    dbClient = testDb;
    redis = testRedis;
    emailQueue = testQueue;

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.OK);

    const json = await response.json();
    expect(json.status).toMatch(/healthy/i);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("connected");
    expect(json.readiness.redis).toBe("connected");
    expect(json.readiness.emailQueue).toBe("connected");
  });

  it("get /healthcheck handles all services unavailable", async () => {
    dbClient = drizzle({ client: "" as unknown as TPool });
    redis = new Redis({
      port: 0,
      retryStrategy: () => {},
    });
    emailQueue = createQueue("test", {
      port: 0,
      host: "host",
      retryStrategy: redisConfig.retryStrategy,
    });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
    expect(json.readiness.redis).toBe("disconnected");
    expect(json.readiness.emailQueue).toBe("disconnected");
  });

  it("get /healthcheck handles database service unavailable", async () => {
    dbClient = drizzle({ client: "" as unknown as TPool });
    redis = testRedis;
    emailQueue = testQueue;

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
    expect(json.readiness.redis).toBe("connected");
    expect(json.readiness.emailQueue).toBe("connected");
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

  it("get /healthcheck handles emailQueue service unavailable", async () => {
    dbClient = testDb;
    redis = testRedis;
    emailQueue = createQueue("test", {
      port: 0,
      host: "host",
      retryStrategy: redisConfig.retryStrategy,
    });

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/healthy/i);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("connected");
    expect(json.readiness.redis).toBe("connected");
    expect(json.readiness.emailQueue).toBe("disconnected");
  });
});

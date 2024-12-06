import { testClient } from "hono/testing";
import { Pool, type Pool as TPool } from "pg";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer } from "@testcontainers/redis";
import type { StartedRedisContainer } from "@testcontainers/redis";
import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@/lib/http-status-codes";
import { healthcheckRouter } from "../healthcheck.index";
import { drizzle } from "drizzle-orm/node-postgres";
import { Redis } from "ioredis";

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

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", healthcheckRouter));

describe("healthcheck routes", () => {
  let pgContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let pool: TPool;

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();

    redisContainer = await new RedisContainer().start();

    pool = new Pool({
      connectionString: pgContainer.getConnectionUri(),
    });
  });

  afterAll(async () => {
    await pool.end();
    await pgContainer.stop();
    await redisContainer.stop();
    vi.clearAllMocks();
  });

  it("get /healthcheck handles service available", async () => {
    dbClient = drizzle({ client: pool });
    redis = new Redis(redisContainer.getConnectionUrl());

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
    redis = new Redis(redisContainer.getConnectionUrl());

    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.SERVICE_UNAVAILABLE);

    const json = await response.json();
    expect(json.status).toMatch(/unhealthy/);
    expect(json.environment).toBe("test");
    expect(json.readiness.database).toBe("disconnected");
    expect(json.readiness.redis).toBe("connected");
  });

  it("get /healthcheck handles redis service unavailable", async () => {
    dbClient = drizzle({ client: pool });
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

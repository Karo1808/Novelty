/* eslint-disable import/no-mutable-exports */
import path from "node:path";
import * as schema from "@novelty/db/schemas/index.schema";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { afterAll, beforeAll, vi } from "vitest";
import { Pool, type Pool as TPool } from "pg";
import type { DBClient } from "@novelty/db/lib/types";
import { drizzle } from "drizzle-orm/node-postgres";
import { Redis, type Redis as TRedis } from "ioredis";
import type { StartedRedisContainer } from "@testcontainers/redis";
import { RedisContainer } from "@testcontainers/redis";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let dbContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;
let pool: TPool;
let testDb: DBClient;
let testRedis: TRedis;

beforeAll(async () => {
  dbContainer = await new PostgreSqlContainer()
    .withStartupTimeout(12000)
    .start();
  redisContainer = await new RedisContainer().start();

  testRedis = new Redis(redisContainer.getConnectionUrl());

  pool = new Pool({
    connectionString: dbContainer.getConnectionUri(),
  });
  testDb = drizzle({ client: pool, schema });

  const migrationsFolder = path.resolve(
    __dirname,
    "../../../packages/db/migrations",
  );
  await migrate(testDb, {
    migrationsFolder,
  });
});

afterAll(async () => {
  await pool.end();
  await redisContainer.stop();
  await dbContainer.stop();
  vi.clearAllMocks();
});

export { testDb, testRedis };

/* eslint-disable import/no-mutable-exports */
import path from "node:path";
import * as schema from "./schemas/index.schema";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { afterAll, beforeAll, vi } from "vitest";
import { Pool } from "pg";
import type { Pool as TPool } from "pg";
import type { DBClient, Dependencies } from "lib/types";
import { drizzle } from "drizzle-orm/node-postgres";
import { configureLogger } from "@novelty/lib/logger";
import { Registry } from "prom-client";
import type { Logger } from "@novelty/lib/types";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let container: StartedPostgreSqlContainer;
let pool: TPool;
let testDb: DBClient;
let testDependencies: Dependencies;
let testLogger: Logger;

beforeAll(async () => {
  container = await new PostgreSqlContainer().withStartupTimeout(12000).start();

  pool = new Pool({
    connectionString: container.getConnectionUri(),
  });

  testDb = drizzle({ client: pool, schema });

  const migrationsFolder = path.resolve(__dirname, "./migrations");

  await migrate(testDb, {
    migrationsFolder,
  });

  testLogger = configureLogger({
    nodeEnvironment: "test",
    hostUrl: "",
    labels: {},
    logLevel: "info",
  });

  testDependencies = {
    dbInstance: testDb,
    logger: testLogger,
    reqId: "test-req-id",
    prometheusRegistry: new Registry(),
  };
});

afterAll(async () => {
  await pool.end();
  await container.stop();
  vi.clearAllMocks();
});

export { testDb, testDependencies, testLogger };

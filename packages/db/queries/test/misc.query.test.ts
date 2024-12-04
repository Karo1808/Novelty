import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { getStatusQuery } from "../misc.query";
import type { DBClient, Dependencies } from "../../lib/types";
import { configureLogger } from "@novelty/lib/logger";
import { Pool } from "pg";
import { Registry } from "prom-client";
import type { Pool as TPool } from "pg";

import "dotenv/config";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("getStatusQuery", () => {
  let container: any;
  let pool: TPool;
  let dbClient: DBClient;
  let dependencies: Dependencies;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();

    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });

    dbClient = drizzle({ client: pool });

    const logger = configureLogger({
      nodeEnvironment: "test",
      hostUrl: "",
      labels: {},
      logLevel: "info",
    });

    dependencies = {
      dbInstance: dbClient,
      logger,
      reqId: "test-req-id",
      prometheusRegistry: new Registry(),
    };
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    vi.clearAllMocks();
  });

  it("executes the SELECT 1 query successfully", async () => {
    const result = await getStatusQuery(dependencies);
    expect(result).toBeTruthy();
  });
});

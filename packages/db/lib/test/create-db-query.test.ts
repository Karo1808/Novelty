import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { createDBQuery } from "../create-db-query";
import { DatabaseConnectionError, QueryExecutionError } from "../errors";
import { Registry } from "prom-client";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { configureLogger } from "@novelty/lib/logger";
import type { DBClient, Dependencies } from "lib/types";
import { sql } from "drizzle-orm";
import type { Pool as TPool } from "pg";
import { Pool } from "pg";
import * as Sentry from "@novelty/lib/sentry";
import * as metrics from "../metrics";
import "dotenv/config";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("createDBQuery", () => {
  let container: any;
  let pool: TPool;
  let dbClient: DBClient;
  let dependencies: Dependencies;
  let logger: any;
  let loggerErrorSpy: any;
  let captureExceptionSpy: any;
  let endTimerSpy: any;
  let startTimerSpy: any;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withStartupTimeout(12000)
      .start();
    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });
    dbClient = drizzle({ client: pool });
    logger = configureLogger({
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

    loggerErrorSpy = vi.spyOn(logger, "error");

    captureExceptionSpy = vi.spyOn(Sentry, "captureException");

    const histogram = metrics.dbQueryDurationHistogram(
      dependencies.prometheusRegistry,
    );
    startTimerSpy = vi.spyOn(histogram, "startTimer").mockImplementation(() => {
      endTimerSpy = vi.fn();
      return endTimerSpy;
    });
  });

  beforeEach(() => {
    loggerErrorSpy.mockClear();
    captureExceptionSpy.mockClear();
    startTimerSpy.mockClear();
    if (endTimerSpy) {
      endTimerSpy.mockClear();
    }
  });

  afterAll(async () => {
    await pool.end();
    await container.stop();
    vi.clearAllMocks();
  });

  it("executes a successful query", async () => {
    const result = await createDBQuery({
      dependencies,
      queryName: "insert-test",
      query: async (db) => {
        const res = await db.execute(sql`SELECT 1`);
        return res;
      },
    });
    expect(result).toBeTruthy();

    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "insert-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "success" });

    expect(loggerErrorSpy).not.toHaveBeenCalled();
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it("handles query errors", async () => {
    await expect(
      createDBQuery({
        dependencies,
        queryName: "error-test",
        query: async (db) => {
          await db.execute(sql`SELEC 1`); // Intentional typo to cause an error
        },
      }),
    ).rejects.toThrow(QueryExecutionError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "Query execution failed for error-test",
        ),
        source: "error-test",
        error: expect.any(String),
        stackTrace: expect.any(String),
        reqId: "test-req-id",
      }),
    );

    expect(captureExceptionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        tags: expect.arrayContaining([
          { name: "requestId", value: "test-req-id" },
        ]),
        breadcrumb: {
          category: "database query",
          message: expect.any(String),
          level: "error",
        },
        contextName: "error-test",
        context: { queryName: "error-test" },
      }),
    );

    // Verify that the timer was ended with a failure status
    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "error-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "failure" });
  });

  it("throws DatabaseConnectionError when connection was not established", async () => {
    const mockDbInstance = {
      execute: vi.fn().mockImplementation(() => {
        throw new Error("Connection error");
      }),
    } as unknown as DBClient;
    const invalidDependencies = {
      ...dependencies,
      dbInstance: mockDbInstance,
    };
    await expect(
      createDBQuery({
        dependencies: invalidDependencies,
        queryName: "no-db-test",
        query: async (db) => {
          await db.execute("SELECT 1");
        },
      }),
    ).rejects.toThrow(DatabaseConnectionError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Database connection could not be established",
        source: "no-db-test",
        error: "Connection error",
        stackTrace: expect.any(String),
        reqId: "test-req-id",
      }),
    );

    expect(captureExceptionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        tags: expect.arrayContaining([
          { name: "requestId", value: "test-req-id" },
        ]),
        breadcrumb: {
          category: "database query",
          message: "Connection error",
          level: "error",
        },
        contextName: "no-db-test",
        context: { queryName: "no-db-test" },
      }),
    );

    expect(startTimerSpy).not.toHaveBeenCalled();
  });

  it("handles query timeout", async () => {
    await expect(
      createDBQuery({
        dependencies,
        queryName: "timeout-test",
        timeoutDurationMs: 1000,
        query: async (db) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await db.execute("SELECT 1");
        },
      }),
    ).rejects.toThrow(QueryExecutionError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "Query execution failed for timeout-test",
        ),
        source: "timeout-test",
        error: expect.stringContaining("Query timed out after 1000"),
        stackTrace: expect.any(String),
        reqId: "test-req-id",
      }),
    );

    expect(captureExceptionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        tags: expect.arrayContaining([
          { name: "requestId", value: "test-req-id" },
        ]),
        breadcrumb: {
          category: "database query",
          message: "Query timed out after 1000 ms",
          level: "error",
        },
        contextName: "timeout-test",
        context: { queryName: "timeout-test" },
      }),
    );

    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "timeout-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "failure" });
  });
});

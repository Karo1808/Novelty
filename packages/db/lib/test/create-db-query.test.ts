import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createDBQuery } from "../create-db-query";
import { DatabaseConnectionError, QueryExecutionError } from "../errors";
import type { DBClient } from "lib/types";
import { sql } from "drizzle-orm";
import * as Sentry from "@novelty/lib/sentry";
import * as metrics from "../metrics";
import "dotenv/config";
import { testDependencies } from "test-setup";

describe("createDBQuery", () => {
  let captureExceptionSpy: any;
  let endTimerSpy: any;
  let startTimerSpy: any;

  beforeAll(async () => {
    captureExceptionSpy = vi.spyOn(Sentry, "captureException");

    const histogram = metrics.dbQueryDurationHistogram(
      testDependencies.prometheusRegistry,
    );
    startTimerSpy = vi.spyOn(histogram, "startTimer").mockImplementation(() => {
      endTimerSpy = vi.fn();
      return endTimerSpy;
    });
  });

  beforeEach(() => {
    captureExceptionSpy.mockClear();
    startTimerSpy.mockClear();
    if (endTimerSpy) {
      endTimerSpy.mockClear();
    }
  });

  it("executes a successful query", async () => {
    const result = await createDBQuery({
      dependencies: testDependencies,
      queryName: "insert-test",
      query: async (db) => {
        const res = await db.execute(sql`SELECT 1`);
        return res;
      },
    });
    expect(result).toBeTruthy();

    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "insert-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "success" });

    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it("handles query errors", async () => {
    await expect(
      createDBQuery({
        dependencies: testDependencies,
        queryName: "error-test",
        query: async (db) => {
          await db.execute(sql`SELEC 1`); // Intentional typo to cause an error
        },
      }),
    ).rejects.toThrow(QueryExecutionError);

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
      ...testDependencies,
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
        dependencies: testDependencies,
        queryName: "timeout-test",
        timeoutDurationMs: 1000,
        query: async (db) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await db.execute("SELECT 1");
        },
      }),
    ).rejects.toThrow(QueryExecutionError);

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

import type { Dependencies } from "./types";
import { timeoutQuery } from "@novelty/lib/timeout-query";
import {
  DatabaseConnectionError,
  QueryExecutionError,
  QueryTimeoutError,
} from "./errors";
import { captureException } from "@novelty/lib/sentry";
import { dbQueryDurationHistogram } from "./metrics";

interface CreateDBQueryParams<T> {
  query: (db: Dependencies["dbInstance"]) => Promise<T>;
  queryName?: string;
  timeoutDurationMs?: number;
  dependencies: Dependencies;
}

export const createDBQuery = async <T>({
  dependencies,
  query,
  queryName = "unknown query",
  timeoutDurationMs = 3000,
}: CreateDBQueryParams<T>): Promise<T> => {
  const { dbInstance, logger, reqId, prometheusRegistry } = dependencies;

  try {
    await dbInstance.execute("SELECT 1");
  }
  catch (error) {
    logger.error({
      message: "Database connection could not be established",
      source: queryName,
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
      reqId,
    });

    captureException({
      error: error as Error,
      tags: [{ name: "requestId", value: reqId }],
      breadcrumb: {
        category: "database query",
        message: (error as Error).message,
        level: "error",
      },
      contextName: queryName,
      context: { queryName },
    });

    throw new DatabaseConnectionError(
      "Database connection could not be established",
      error as Error,
    );
  }

  const endTimer = dbQueryDurationHistogram(prometheusRegistry).startTimer({
    queryName,
  });

  try {
    const res = await timeoutQuery({
      query: query(dbInstance),
      timeoutDuration: timeoutDurationMs,
      customError: new QueryTimeoutError(timeoutDurationMs),
      queryName,
      logger,
    });
    endTimer({ status: "success" });
    return res;
  }
  catch (error) {
    logger.error({
      message: `Query execution failed for ${queryName}`,
      source: queryName,
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
      reqId,
    });
    captureException({
      error: error as Error,
      tags: [{ name: "requestId", value: reqId }],
      breadcrumb: {
        category: "database query",
        message: (error as Error).message,
        level: "error",
      },
      contextName: queryName,
      context: { queryName },
    });
    endTimer({ status: "failure" });
    throw new QueryExecutionError(queryName, error as Error);
  }
};

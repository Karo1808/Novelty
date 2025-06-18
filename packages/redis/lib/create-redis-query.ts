import type { Redis } from "ioredis";
import type Redlock from "redlock";
import type { Dependencies } from "./types";
import { captureException } from "@novelty/lib/sentry";
import { timeoutQuery } from "@novelty/lib/timeout-query";
import {
  RedisConnectionError,
  RedisQueryError,
  RedisTimeoutError,
} from "./errors";
import { redisQueryDurationHistogram } from "./metrics";

interface CreateDBQueryParams<T> {
  query: (redis: Redis) => Promise<T>;
  queryName?: string;
  timeoutDurationMs?: number;
  dependencies: Dependencies;
}

export const createRedisQuery = async <T>({
  dependencies,
  query,
  queryName = "unknown query",
  timeoutDurationMs = 3000,
}: CreateDBQueryParams<T>): Promise<T> => {
  const { redisClient, logger, reqId, prometheusRegistry } = dependencies;

  try {
    const response = await redisClient.ping();
    if (response !== "PONG") {
      throw new RedisConnectionError("Unexpected PING response");
    }
  }
  catch (error) {
    logger.error({
      message: "Redis connection could not be established",
      source: queryName,
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
      reqId,
    });

    captureException({
      error: error as Error,
      tags: [{ name: "requestId", value: reqId }],
      breadcrumb: {
        category: "redis query",
        message: (error as Error).message,
        level: "error",
      },
      contextName: queryName,
      context: { queryName },
    });

    throw new RedisConnectionError(
      "Redis connection could not be established",
      error as Error,
    );
  }

  const endTimer = redisQueryDurationHistogram(prometheusRegistry).startTimer({
    queryName,
  });

  try {
    const res = await timeoutQuery({
      query: query(redisClient),
      queryName,
      customError: new RedisTimeoutError(timeoutDurationMs),
      timeoutDuration: timeoutDurationMs,
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
        category: "redis query",
        message: (error as Error).message,
        level: "error",
      },
      contextName: queryName,
      context: { queryName },
    });
    endTimer({ status: "failure" });
    throw new RedisQueryError(queryName, error as Error);
  }
};

interface CreateRedlockQueryParams<T> {
  query: (redlock: Redlock) => Promise<T>;
  queryName?: string;
  timeoutDurationMs?: number;
  dependencies: Dependencies;
}

export const createRedlockQuery = async <T>({
  dependencies,
  query,
  queryName = "unknown redlock query",
  timeoutDurationMs = 3000,
}: CreateRedlockQueryParams<T>): Promise<T> => {
  const { logger, reqId, prometheusRegistry, redlockClient } = dependencies;

  if (!redlockClient) {
    throw new RedisConnectionError("Redlock client not available");
  }

  const endTimer = redisQueryDurationHistogram(prometheusRegistry).startTimer({
    queryName,
  });

  try {
    const res = await timeoutQuery({
      query: query(redlockClient),
      queryName,
      customError: new RedisTimeoutError(timeoutDurationMs),
      timeoutDuration: timeoutDurationMs,
      logger,
    });
    endTimer({ status: "success" });
    return res;
  }
  catch (error) {
    logger.error({
      message: `Redlock query execution failed for ${queryName}`,
      source: queryName,
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
      reqId,
    });
    captureException({
      error: error as Error,
      tags: [{ name: "requestId", value: reqId }],
      breadcrumb: {
        category: "redlock query",
        message: (error as Error).message,
        level: "error",
      },
      contextName: queryName,
      context: { queryName },
    });
    endTimer({ status: "failure" });
    throw new RedisQueryError(queryName, error as Error);
  }
};

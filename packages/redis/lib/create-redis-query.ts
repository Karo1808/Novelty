import type { Dependencies } from "./types";
import { timeoutQuery } from "@novelty/lib/timeout-query";
import {
  RedisConnectionError,
  RedisQueryError,
  RedisTimeoutError,
} from "./errors";
import { captureException } from "@novelty/lib/sentry";
import { redisQueryDurationHistogram } from "./metrics";
import type { Redis } from "ioredis";

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

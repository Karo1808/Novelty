import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { Command, Redis as TRedis } from "ioredis";
import { Redis } from "ioredis";
import { createRedisQuery } from "../create-redis-query";
import { RedisConnectionError, RedisQueryError } from "../errors";
import { Registry } from "prom-client";
import type { StartedRedisContainer } from "@testcontainers/redis";
import { RedisContainer } from "@testcontainers/redis";
import { configureLogger } from "@novelty/lib/logger";
import type { Dependencies } from "../types";
import * as Sentry from "@novelty/lib/sentry";
import * as metrics from "../metrics";
import "dotenv/config";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("createRedisQuery", () => {
  let container: StartedRedisContainer;
  let redisClient: TRedis;
  let dependencies: Dependencies;
  let logger: any;
  let loggerErrorSpy: any;
  let captureExceptionSpy: any;
  let endTimerSpy: any;
  let startTimerSpy: any;

  beforeAll(async () => {
    container = await new RedisContainer().start();

    redisClient = new Redis(container.getConnectionUrl());

    logger = configureLogger({
      nodeEnvironment: "test",
      hostUrl: "",
      labels: {},
      logLevel: "info",
    });
    dependencies = {
      redisClient,
      logger,
      reqId: "test-req-id",
      prometheusRegistry: new Registry(),
    };

    loggerErrorSpy = vi.spyOn(logger, "error");

    captureExceptionSpy = vi.spyOn(Sentry, "captureException");

    const histogram = metrics.redisQueryDurationHistogram(
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
    await container.stop();
    vi.clearAllMocks();
  });

  it("executes a successful query", async () => {
    const result = await createRedisQuery({
      dependencies,
      queryName: "ping-test",
      query: async (redis) => {
        const res = await redis.ping();
        return res;
      },
    });
    expect(result).toBeTruthy();

    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "ping-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "success" });

    expect(loggerErrorSpy).not.toHaveBeenCalled();
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it("handles query errors", async () => {
    await expect(
      createRedisQuery({
        dependencies,
        queryName: "error-test",
        query: async (redis) => {
          await redis.sendCommand(
            "NONE_EXISTENT_COMMAND" as unknown as Command,
          );
        },
      }),
    ).rejects.toThrow(RedisQueryError);

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
          category: "redis query",
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
    const mockRedisClient = {
      execute: vi.fn().mockImplementation(() => {
        throw new Error("Connection error");
      }),
    } as unknown as TRedis;
    const invalidDependencies = {
      ...dependencies,
      redisClient: mockRedisClient,
    };
    await expect(
      createRedisQuery({
        dependencies: invalidDependencies,
        queryName: "no-redis-test",
        query: async (redis) => {
          await redis.ping();
        },
      }),
    ).rejects.toThrow(RedisConnectionError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Redis connection could not be established",
        source: "no-redis-test",
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
          category: "redis query",
          message: expect.any(String),
          level: "error",
        },
        contextName: "no-redis-test",
        context: { queryName: "no-redis-test" },
      }),
    );

    expect(startTimerSpy).not.toHaveBeenCalled();
  });

  it("handles query timeout", async () => {
    await expect(
      createRedisQuery({
        dependencies,
        queryName: "timeout-test",
        timeoutDurationMs: 1000,
        query: async (redis) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await redis.ping();
        },
      }),
    ).rejects.toThrowError();

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "Query execution failed for timeout-test",
        ),
        source: "timeout-test",
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
          category: "redis query",
          message: "Redis operation timed out after 1000 ms",
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

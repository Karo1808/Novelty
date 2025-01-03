import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { Command, Redis as TRedis } from "ioredis";
import { createRedisQuery } from "../create-redis-query";
import { RedisConnectionError, RedisQueryError } from "../errors";
import * as Sentry from "@novelty/lib/sentry";
import * as metrics from "../metrics";
import "dotenv/config";
import { testDependencies } from "test-setup";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("createRedisQuery", () => {
  let captureExceptionSpy: any;
  let endTimerSpy: any;
  let startTimerSpy: any;

  beforeAll(async () => {
    captureExceptionSpy = vi.spyOn(Sentry, "captureException");

    const histogram = metrics.redisQueryDurationHistogram(
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
    const result = await createRedisQuery({
      dependencies: testDependencies,
      queryName: "ping-test",
      query: async (redis) => {
        const res = await redis.ping();
        return res;
      },
    });
    expect(result).toBeTruthy();

    expect(startTimerSpy).toHaveBeenCalledWith({ queryName: "ping-test" });
    expect(endTimerSpy).toHaveBeenCalledWith({ status: "success" });

    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it("handles query errors", async () => {
    await expect(
      createRedisQuery({
        dependencies: testDependencies,
        queryName: "error-test",
        query: async (redis) => {
          await redis.sendCommand(
            "NONE_EXISTENT_COMMAND" as unknown as Command,
          );
        },
      }),
    ).rejects.toThrow(RedisQueryError);

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
      ...testDependencies,
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
        dependencies: testDependencies,
        queryName: "timeout-test",
        timeoutDurationMs: 1000,
        query: async (redis) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await redis.ping();
        },
      }),
    ).rejects.toThrowError();

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

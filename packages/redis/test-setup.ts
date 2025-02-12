/* eslint-disable import/no-mutable-exports */
import { RedisContainer } from "@testcontainers/redis";
import type { StartedRedisContainer } from "@testcontainers/redis";
import { afterAll, beforeAll, vi } from "vitest";
import { Redis } from "ioredis";
import type { Redis as TRedis } from "ioredis";
import { configureLogger } from "@novelty/lib/logger";
import { Registry } from "prom-client";
import type { Logger } from "@novelty/lib/types";
import type { Dependencies } from "lib/types";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let container: StartedRedisContainer;
let testClient: TRedis;
let testDependencies: Dependencies;
let testLogger: Logger;

beforeAll(async () => {
  container = await new RedisContainer().start();

  testClient = new Redis(container.getConnectionUrl());

  testLogger = configureLogger({
    nodeEnvironment: "test",
    hostUrl: "",
    labels: {},
    logLevel: "info",
  });

  testDependencies = {
    redisClient: testClient,
    logger: testLogger,
    reqId: "test-req-id",
    prometheusRegistry: new Registry(),
  };
});

afterAll(async () => {
  await container.stop();
  vi.clearAllMocks();
});

export { testClient, testDependencies, testLogger };

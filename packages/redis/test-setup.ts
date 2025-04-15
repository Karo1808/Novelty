/* eslint-disable import/no-mutable-exports */
import { afterAll, beforeAll, vi } from "vitest";
import { Redis } from "ioredis";
import type { Redis as TRedis } from "ioredis";
import { configureLogger } from "@novelty/lib/logger";
import { Registry } from "prom-client";
import type { Logger } from "@novelty/lib/types";
import type { Dependencies } from "lib/types";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer } from "testcontainers";
import Redlock from "redlock";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

let container: StartedTestContainer;
let testClient: TRedis;
let testDependencies: Dependencies;
let testLogger: Logger;
let testRedlockClient: Redlock;

beforeAll(async () => {
  container = await new GenericContainer("redis/redis-stack-server:latest")
    .withExposedPorts(6379) // Expose the default Redis port
    .start();

  testClient = new Redis({
    host: container.getHost(),
    port: container.getMappedPort(6379), // Must match the above
  });

  testClient.on("error", () => {});

  const redisClients = [testClient];

  const testRedlockClient = new Redlock(redisClients);

  testLogger = configureLogger({
    nodeEnvironment: "test",
    hostUrl: "",
    labels: {},
    logLevel: "info",
  });

  testDependencies = {
    redisClient: testClient,
    redlockClient: testRedlockClient,
    logger: testLogger,
    reqId: "test-req-id",
    prometheusRegistry: new Registry(),
  };
});

afterAll(async () => {
  await container.stop();
  vi.clearAllMocks();
});

export { testClient, testDependencies, testLogger, testRedlockClient };

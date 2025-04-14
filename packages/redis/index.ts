/* eslint-disable node/no-process-env */
import { Redis } from "ioredis";
import "dotenv/config";
import { configureLogger } from "@novelty/lib/logger";
import type { NodeEnvironment } from "@novelty/lib/types";
import Redlock from "redlock";

const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisPort || !redisPassword) {
  throw new Error("Missing redis configuration environment variables");
}

const logger = configureLogger({
  nodeEnvironment: process.env.NODE_ENV! as NodeEnvironment,
  hostUrl: "localhost:3000",
  labels: {
    source: "redis",
    environment: process.env.NODE_ENV! as NodeEnvironment,
  },
  logLevel: "info",
});

export const redis = new Redis({
  host: "localhost",
  port: Number(redisPort),
  maxRetriesPerRequest: null,
  connectTimeout: 3000,
  retryStrategy(times) {
    if (times % 4 === 0) {
      logger.error({
        message: "redisRetryError",
        error: "Redis reconnect exhausted after 3 retries.",
      });
      return null;
    }

    return 200;
  },
});

const redisClients = [redis];

export const redlock = new Redlock(redisClients, {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 200,
});

redlock.on("error", (err: unknown) => {
  logger.error({
    message: "Failed to initialize Redlock",
    error: err,
  });
});

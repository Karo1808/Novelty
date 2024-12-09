/* eslint-disable node/no-process-env */
import { Redis } from "ioredis";
import "dotenv/config";
import { configureLogger } from "@novelty/lib/logger";
import type { NodeEnvironment } from "@novelty/lib/types";

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

/* eslint-disable node/no-process-env */
import { Redis } from "ioredis";
import "dotenv/config";

const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisPort || !redisPassword) {
  throw new Error("Missing redis configuration environment variables");
}

export const redis = new Redis({
  host: "localhost",
  port: Number(redisPort),
  maxRetriesPerRequest: 0,
});

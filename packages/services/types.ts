import type { DBClient } from "@novelty/db/lib/types";
import type { Redis } from "ioredis";
import type { Logger, PrometheusRegistry } from "@novelty/lib/types";

export interface ServiceDependencies {
  dbInstance: DBClient;
  redisClient: Redis;
  reqId: string;
  logger: Logger;
  prometheusRegistry: PrometheusRegistry;
}

export interface ServiceResponse {
  status: number;
  body?: any;
  source?: "db" | "redis";
  error?: Error;
}

import type { DBClient } from "@novelty/db/lib/types";
import type { Redis } from "ioredis";
import type { Logger, PrometheusRegistry } from "@novelty/lib/types";
import type { Queue } from "bullmq";

export interface ServiceDependencies {
  dbInstance: DBClient;
  redisClient: Redis;
  messageQueueInstance?: Queue;
  reqId: string;
  logger: Logger;
  prometheusRegistry: PrometheusRegistry;
}

export interface ServiceResponse<TStatusCodes> {
  status: TStatusCodes;
  body?: any;
  source?: "db" | "redis";
  error?: Error;
}

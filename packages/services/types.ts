import type { DBClient } from "@novelty/db/lib/types";
import type { Redis } from "ioredis";
import type { Logger, PrometheusRegistry } from "@novelty/lib/types";
import type { Queue } from "bullmq";
import type { S3Client } from "@aws-sdk/client-s3";

export interface ServiceDependencies {
  dbInstance: DBClient;
  redisClient: Redis;
  messageQueueInstance?: Queue;
  s3Client?: S3Client;
  reqId: string;
  logger: Logger;
  prometheusRegistry: PrometheusRegistry;
  bucketName?: string;
}

export interface ServiceResponse<TStatusCodes> {
  status: TStatusCodes;
  body?: any;
  source?: "db" | "redis";
  error?: Error;
}

import type { S3Client } from "@aws-sdk/client-s3";
import type { DBClient } from "@novelty/db/lib/types";
import type { HttpStatusCodeKey } from "@novelty/lib/http-status-codes";
import type { Logger, PrometheusRegistry } from "@novelty/lib/types";
import type { AmazonCognito, Google } from "arctic";
import type { Queue } from "bullmq";
import type { Redis } from "ioredis";
import type Redlock from "redlock";

export interface ServiceDependencies {
  dbInstance: DBClient;
  redisClient: Redis;
  redlockClient?: Redlock;
  messageQueueInstance?: Queue;
  s3Client?: S3Client;
  reqId: string;
  logger: Logger;
  prometheusRegistry: PrometheusRegistry;
  bucketName?: string;
  providers?: { google: Google; amazon: AmazonCognito };
}

export type Result<TSuccessData, TErrorReason> =
  | { success: true; data: TSuccessData }
  | { success: false; error: TErrorReason };

export interface ErrorResponse<K extends HttpStatusCodeKey> {
  kind: K;
  message: string;
  cause?: unknown;
}

export type RegisterUserError =
  | ErrorResponse<"CONFLICT">
  | ErrorResponse<"INTERNAL_SERVER_ERROR">;

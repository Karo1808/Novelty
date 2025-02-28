import type { AppRouteHandler } from "@/types/index.types";
import {
  checkDbHealth,
  checkEmailQueueHealth,
  checkR2Health,
  checkRedisHealth,
} from "@novelty/services/healthcheck.service";
import env from "@/env";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import type { HealthcheckRoute } from "./healthcheck.routes";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { db } from "@novelty/db/index";
import { redis } from "@novelty/redis";
import { emailQueue } from "@novelty/message-queue/queues/email.queue";
import { s3Client } from "@novelty/lib/s3-client";

interface Response {
  dbStatus?: boolean;
  redisStatus?: boolean;
  emailQueueStatus?: boolean;
  r2Status?: boolean;
}

export const handleHealthcheck: AppRouteHandler<HealthcheckRoute> = async (
  c,
) => {
  c.var.logger.info({
    message: "API status requested",
    reqId: c.var.requestId,
  });

  const res: Response = {};

  try {
    res.dbStatus = !!(await checkDbHealth({
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    }));
  }
  catch (error) {
    c.var.logger.error({
      message: "Database connection error",
      source: "handleHealthcheck",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });
  }

  try {
    res.redisStatus = !!(await checkRedisHealth({
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    }));
  }
  catch (error) {
    c.var.logger.error({
      message: "Redis connection error",
      source: "handleHealthcheck",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });
  }

  try {
    res.emailQueueStatus = !!(await checkEmailQueueHealth({
      messageQueueInstance: emailQueue,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    }));
  }
  catch (error) {
    c.var.logger.error({
      message: "Email queue connection error",
      source: "handleHealthcheck",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });
  }

  try {
    res.r2Status = !!(await checkR2Health({
      s3Client,
      logger,
      reqId: c.var.requestId,
      prometheusRegistry,
    }));
  }
  catch (error) {
    c.var.logger.error({
      message: "R2 connection error",
      source: "handleHealthcheck",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });
  }

  if (
    !res.dbStatus
    || !res.redisStatus
    || !res.emailQueueStatus
    || !res.r2Status
  ) {
    return c.json(
      {
        status: "unhealthy",
        environment: env.NODE_ENV ?? "development",
        readiness: {
          database: res?.dbStatus ? "connected" : "disconnected",
          redis: res?.redisStatus ? "connected" : "disconnected",
          emailQueue: res?.emailQueueStatus ? "connected" : "disconnected",
          r2: res.r2Status ? "connected" : "disconnected",
        },
      },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  return c.json(
    {
      status: "healthy",
      environment: env.NODE_ENV ?? "development",
      readiness: {
        database: "connected",
        redis: "connected",
        emailQueue: "connected",
        r2: "connected",
      },
    },
    HttpStatusCodes.OK,
  );
};

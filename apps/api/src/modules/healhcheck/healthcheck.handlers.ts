import type { AppRouteHandler } from "@/types/index.types";
import { checkDatabaseHealth } from "@novelty/services/healthcheck.service";
import env from "@/env";
import { HttpStatusCodes } from "@/lib/http-status-codes";
import type { HealthcheckRoute } from "./healthcheck.routes";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { db } from "@novelty/db/index";

export const handleHealthcheck: AppRouteHandler<HealthcheckRoute> = async (
  c,
) => {
  c.var.logger.info({
    message: "API status requested",
    reqId: c.var.requestId,
  });

  try {
    await checkDatabaseHealth({
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    });
  }
  catch (error) {
    c.var.logger.error({
      message: "Database connection error",
      source: "handleHealthcheck",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });

    return c.json(
      {
        status: "unhealthy",
        environment: env.NODE_ENV ?? "development",
        readiness: {
          database: "disconnected",
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
      },
    },
    HttpStatusCodes.OK,
  );
};

import type { AppRouteHandler } from "@/types/index.types";

import env from "@/env";
import { HttpStatusCodes } from "@/lib/http-status-codes";

import type { HealthcheckRoute } from "./healthcheck.routes";

export const handleHealthcheck: AppRouteHandler<HealthcheckRoute> = async (
  c,
) => {
  c.var.logger.info("API status requested");
  return c.json(
    {
      status: "healthy",
      environment: env.NODE_ENV ?? "development",
    },
    HttpStatusCodes.OK,
  );
};

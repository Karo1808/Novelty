import type { AppRouteHandler } from "@/types/index.types";

import env from "@/env";
import { HttpStatusCodes } from "@/lib/http-status-codes";

import type { HealthcheckRoute } from "./healthcheck.routes";

export const handleHealthcheck: AppRouteHandler<HealthcheckRoute> = async (
  c,
) => {
  return c.json(
    {
      status: "healthy",
      environment: env.NODE_ENV ?? "development",
    },
    HttpStatusCodes.OK,
  );
};

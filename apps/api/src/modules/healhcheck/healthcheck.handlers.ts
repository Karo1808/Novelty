import type { AppRouteHandler } from "@/types/index.types";

import { HttpStatusCodes } from "@/lib/http-status-codes";

import type { HealthcheckRoute } from "./healthcheck.routes";

export const handleHealthcheck: AppRouteHandler<HealthcheckRoute> = async (
  c,
) => {
  c.var.logger.info("Testing logging");
  return c.json(
    {
      message: "Healthcheck route",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

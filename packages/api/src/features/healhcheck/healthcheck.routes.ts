import { createRoute } from "@hono/zod-openapi";

import { HttpStatusCodes } from "@/lib/http-status-codes";
import jsonContent from "@/lib/json-content";

import { healthcheckSchema } from "./healthcheck.schemas";

export const healthcheckRoute = createRoute({
  tags: ["Healthcheck"],
  method: "get",
  path: "/healthcheck",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(healthcheckSchema, "Healthcheck"),
  },
});

export type HealthcheckRoute = typeof healthcheckRoute;

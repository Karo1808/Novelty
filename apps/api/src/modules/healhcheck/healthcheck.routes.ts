import { jsonContent } from "@/lib/json-content";
import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import {
  healthcheckOkSchema,
  healthcheckUnavailableSchema,
} from "./healthcheck.validations";

export const healthcheckRoute = createRoute({
  tags: ["Healthcheck"],
  method: "get",
  path: "/healthcheck",
  description: "Verifies the status of the API",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthcheckOkSchema,
      "Successful healthcheck",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      healthcheckUnavailableSchema,
      "Service unavailable",
    ),
  },
});

export type HealthcheckRoute = typeof healthcheckRoute;

import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { jsonContent, jsonContentRequired } from "@/lib/json-content";
import {
  registerConflictSchema,
  registerCreatedSchema,
} from "./auth.validations";

import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import createErrorSchema from "@/lib/create-error-schema";
import { serviceUnavailableSchema } from "@/lib/service-unavailable-schema";

const tags = ["Auth"];

export const registerRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/register",
  description: "Creates the unverified user in the database",
  request: {
    body: jsonContentRequired(
      insertUserSchema.shape.register,
      "The user inputted data",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      registerCreatedSchema,
      "Successful registration",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      registerConflictSchema,
      "Existing email",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema.shape.register),
      "Validation error(s)",
    ),
  },
});

export type RegisterRoute = typeof registerRoute;

import { jsonContent } from "@/lib/json-content";
import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import {
  getProfileSuccessSchema,
} from "./user.validations";
import {
  accountNotFoundSchema,
  cookieSchema,
  serviceUnavailableSchema,
  tooManyRequestsSchema,
  unauthenticatedSchema,
} from "@/lib/response-schemas";

const onboardingTags = ["Onboarding"];

export const getProfileRoute = createRoute({
  tags: onboardingTags,
  method: "get",
  path: "/user/profile",
  description: "Returns the user profile",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getProfileSuccessSchema,
      "User profile information",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      accountNotFoundSchema,
      "Account does not exist",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthenticatedSchema,
      "User must be authenticated",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Service unavailable",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type GetProfileRoute = typeof getProfileRoute;

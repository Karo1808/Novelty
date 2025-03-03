import { jsonContent } from "@/lib/json-content";
import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import {
  completeOnboardingConflictSchema,
  completeOnboardingMissingFields,
  getPreferencesSuccessSchema,
  getProfileSuccessSchema,
  updateProfileConflictSchema,
} from "./user.validations";
import {
  accountNotFoundSchema,
  cookieSchema,
  serviceUnavailableSchema,
  tooManyRequestsSchema,
  unauthenticatedSchema,
} from "@/lib/response-schemas";
import { updateUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import createErrorSchema from "@/lib/create-error-schema";
import { updateProfileSchema } from "@novelty/services/lib/utils";

const userTags = ["User"];
const onboardingTags = ["Onboarding"];

export const getProfileRoute = createRoute({
  tags: userTags,
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

export const updateProfileRoute = createRoute({
  tags: userTags,
  method: "patch",
  path: "/user/profile",
  description: "Updates the user profile",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: updateProfileSchema,
        },
      },
    },
    description: "The user inputted data",
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Updated user profile",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      accountNotFoundSchema,
      "Account does not exist",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      updateProfileConflictSchema,
      "Another process handling this query/username already taken",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthenticatedSchema,
      "User must be authenticated",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUserInfoSchema.shape.profile),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type UpdateProfileRoute = typeof updateProfileRoute;

export const getPreferencesRoute = createRoute({
  tags: userTags,
  method: "get",
  path: "/user/preferences",
  description: "Returns the user preferences",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPreferencesSuccessSchema,
      "User preferences information",
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

export type GetPreferencesRoute = typeof getPreferencesRoute;

export const updatePreferencesRoute = createRoute({
  tags: userTags,
  method: "patch",
  path: "/user/preferences",
  description: "Updates the user preferences",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateUserInfoSchema.shape.preferences,
        },
      },
    },
    description: "The user inputted data",
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Updated user preferences",
    },
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
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUserInfoSchema.shape.profile),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type UpdatePreferencesRoute = typeof updatePreferencesRoute;

export const completeOnboardingRoute = createRoute({
  tags: userTags.concat(onboardingTags),
  method: "patch",
  path: "/user/onboarding/complete",
  description: "Completes the onboarding",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Onboarding completed",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      accountNotFoundSchema,
      "Account does not exist",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      completeOnboardingConflictSchema,
      "Already onboarded",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      completeOnboardingMissingFields,
      "Missing required information",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthenticatedSchema,
      "User must be authenticated",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUserInfoSchema.shape.profile),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type CompleteOnboardingRoute = typeof completeOnboardingRoute;

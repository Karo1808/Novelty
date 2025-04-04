import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { jsonContent, jsonContentRequired } from "@/lib/json-content";
import {
  loginSuccessSchema,
  loginUnauthorizedSchema,
  registerConflictSchema,
  registerCreatedSchema,
  sendVerificationEmailConflictSchema,
  sendVerificationEmailNotFoundSchema,
  sendVerificationEmailSuccessSchema,
  verifyEmailBadRequestSchema,
  verifyEmailConflictSchema,
  verifyEmailNotFoundSchema,
  verifyEmailSuccessSchema,
} from "./auth.validations";

import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import createErrorSchema from "@/lib/create-error-schema";
import { verifyEmailBodySchema } from "@novelty/lib/validations/auth";
import {
  blacklistedSchema,
  cookieSchema,
  serviceUnavailableSchema,
  tooManyRequestsSchema,
} from "@/lib/response-schemas";

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

export const sendVerificationEmailRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/send-verification-email",
  description: "Sends the verification email to the user",
  request: {
    body: jsonContentRequired(
      insertUserSchema.shape.sendVerificationEmail,
      "The user email",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      sendVerificationEmailSuccessSchema,
      "Email sent",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      sendVerificationEmailNotFoundSchema,
      "Email not found",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      sendVerificationEmailConflictSchema,
      "Email already verified",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema.shape.sendVerificationEmail),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type SendVerificationEmailRoute = typeof sendVerificationEmailRoute;

export const verifyEmailRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/verify-email",
  description:
    "Verifies the PIN provided by the use, updates the isEmailVerified field in the database, sets the session cookie and caches the user profile data",
  request: {
    body: jsonContentRequired(
      verifyEmailBodySchema,
      "The verification code and encrypted userId",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: verifyEmailSuccessSchema,
        },
      },
      description: "Email verified",
      headers: cookieSchema,
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      verifyEmailNotFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      verifyEmailBadRequestSchema,
      "Verification code does not match or it has expired",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      verifyEmailConflictSchema,
      "Email already verified",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema.shape.sendVerificationEmail),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type VerifyEmailRoute = typeof verifyEmailRoute;

export const loginRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/login",
  description: "Authenticates the user and creates a session",
  request: {
    body: jsonContentRequired(insertUserSchema.shape.login, "User credentials"),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: loginSuccessSchema,
        },
      },
      description: "Authenticates a user and creates a session",
      headers: cookieSchema,
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      loginUnauthorizedSchema,
      "Invalid credentials",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Too many login attempts",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema.shape.register),
      "Validation error(s)",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      blacklistedSchema,
      "Access denied (e.g., account banned, inactive)",
    ),
  },
});

export type LoginRoute = typeof loginRoute;

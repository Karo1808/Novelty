import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { jsonContent, jsonContentRequired } from "@/lib/json-content";
import {
  forgotPasswordConflictSchema,
  forgotPasswordSuccessSchema,
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
import {
  forgotPasswordBodySchema,
  verifyEmailBodySchema,
} from "@novelty/lib/validations/auth";
import {
  blacklistedSchema,
  cookieSchema,
  csrfErrorSchema,
  serviceUnavailableSchema,
  tooManyRequestsSchema,
  unauthenticatedSchema,
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
      insertUserSchema.shape.sendEmail,
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
      createErrorSchema(insertUserSchema.shape.sendEmail),
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
      createErrorSchema(insertUserSchema.shape.sendEmail),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
  },
});

export type VerifyEmailRoute = typeof verifyEmailRoute;

// TODO: update so it returns the user info
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
      createErrorSchema(insertUserSchema.shape.login),
      "Validation error(s)",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      blacklistedSchema,
      "Access denied (e.g., account banned, inactive)",
    ),
  },
});

export type LoginRoute = typeof loginRoute;

export const logoutRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/logout",
  description: "Logouts the user and invalidates the session",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Invalidates the session",
      headers: cookieSchema,
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthenticatedSchema,
      "User must be authenticated",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(csrfErrorSchema, "CSRF failure"),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Too many logout attempts",
    ),
  },
});

export type LogoutRoute = typeof logoutRoute;

export const sendForgotPasswordEmailRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/send-forgot-password-email",
  description: "Sends the forgot password email to the user",
  request: {
    body: jsonContentRequired(
      insertUserSchema.shape.sendEmail,
      "The user email",
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Sends the forgot password email, if user exists",
    },
    [HttpStatusCodes.CONFLICT]: jsonContent(
      forgotPasswordConflictSchema,
      "Lock not acquired",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Too many request attempts",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema.shape.sendEmail),
      "Validation error(s)",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      blacklistedSchema,
      "Access denied (e.g., account banned, inactive)",
    ),
  },
});

export type SendForgotPasswordEmailRoute = typeof sendForgotPasswordEmailRoute;

// TODO: update so it returns the user info
export const forgotPasswordRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/forgot-password",
  description: "Changes the password of the user and sets the session cookie",
  request: {
    body: jsonContentRequired(
      forgotPasswordBodySchema,
      "The token and new password",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: forgotPasswordSuccessSchema,
        },
      },
      description: "Password reset",
      headers: cookieSchema,
    },
    [HttpStatusCodes.CONFLICT]: jsonContent(
      forgotPasswordConflictSchema,
      "Lock not acquired",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      verifyEmailBadRequestSchema,
      "Password reset token does not match or it has expired",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(forgotPasswordBodySchema),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Rate limiter",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(csrfErrorSchema, "CSRF failure"),
  },
});

export type ForgotPasswordRoute = typeof forgotPasswordRoute;

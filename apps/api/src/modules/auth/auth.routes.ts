import createErrorSchema from "@/lib/create-error-schema";
import { jsonContent, jsonContentRequired } from "@/lib/json-content";
import {
  blacklistedSchema,
  cookieSchema,
  csrfErrorSchema,
  locationSchema,
  oAuthHeaderSchema,
  serviceUnavailableSchema,
  tooManyRequestsSchema,
  unauthenticatedSchema,
} from "@/lib/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";

import { insertAuthProviderSchema } from "@novelty/db/schemas/auth-provider.schema";
import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import {
  forgotPasswordBodySchema,
  verifyEmailBodySchema,
} from "@novelty/lib/validations/auth";
import {
  forgotPasswordConflictSchema,
  forgotPasswordSuccessSchema,
  getAuthMeSuccessSchema,
  loginSuccessSchema,
  loginUnauthorizedSchema,
  logoutSuccessSchema,
  oAuthCallbackBadRequestSchema,
  oAuthCallbackQuerySchema,
  oauthInitParamsSchema,
  oAuthInitSuccessSchema,
  registerConflictSchema,
  registerCreatedSchema,
  sendVerificationEmailConflictSchema,
  sendVerificationEmailSuccessSchema,
  verifyEmailBadRequestSchema,
  verifyEmailConflictSchema,
  verifyEmailNotFoundSchema,
  verifyEmailSuccessSchema,
} from "./auth.validations";

const tags = ["Auth"];

export const authMeRoute = createRoute({
  tags,
  method: "get",
  path: "/auth/me",
  description: "Validates the session and returns userId",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(getAuthMeSuccessSchema, "Valid session"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthenticatedSchema,
      "Invalid session",
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

export type AuthMeRoute = typeof authMeRoute;

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
    [HttpStatusCodes.CONFLICT]: jsonContent(
      sendVerificationEmailConflictSchema,
      "Lock not acquired",
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
    "Verifies the PIN provided by the user, updates the isEmailVerified field in the database",
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

export const oAuthInitRoute = createRoute({
  tags: [...tags, "OAuth"],
  method: "get",
  path: "/auth/oauth/{provider}",
  description: "Redirects to the OAuth provider",
  request: {
    params: oauthInitParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/json": {
          schema: oAuthInitSuccessSchema,
        },
      },
      description: "Redirects to the OAuth provider",
      headers: oAuthHeaderSchema,
    },
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      serviceUnavailableSchema,
      "Services unavailable",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertAuthProviderSchema.shape.init),
      "Validation error(s)",
    ),
    [HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
      tooManyRequestsSchema,
      "Too many login attempts",
    ),
  },
});

export type OAuthInitRoute = typeof oAuthInitRoute;

export const oAuthCallbackRoute = createRoute({
  tags: [...tags, "OAuth"],
  method: "get",
  path: "/auth/oauth/{provider}/callback",
  description:
    "Retrieves user information, creates the user and establishes session",
  request: {
    params: oauthInitParamsSchema,
    query: oAuthCallbackQuerySchema,
  },
  responses: {
    [HttpStatusCodes.FOUND]: {
      description:
        "Authenticates a user and creates a session and returns user data",
      headers: z.object({
        cookie: cookieSchema.shape.cookie,
        location: locationSchema.shape.Location,
      }),
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      oAuthCallbackBadRequestSchema,
      "Missing request data",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      loginUnauthorizedSchema,
      "Invalid credentials",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertAuthProviderSchema.shape.init),
      "Validation error(s)",
    ),
  },
});

export type OAuthCallbackRoute = typeof oAuthCallbackRoute;

export const logoutRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/logout",
  description: "Logouts the user and invalidates the session",
  request: {
    headers: cookieSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      logoutSuccessSchema,
      "Invalidates the session",
    ),
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
    [HttpStatusCodes.OK]: jsonContent(verifyEmailSuccessSchema, "Email sent"),

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
    [HttpStatusCodes.FORBIDDEN]: jsonContent(csrfErrorSchema, "CSRF failure"),
  },
});

export type SendForgotPasswordEmailRoute = typeof sendForgotPasswordEmailRoute;

export const forgotPasswordRoute = createRoute({
  tags,
  method: "post",
  path: "/auth/forgot-password",
  description:
    "Changes the password of the user, sets the session cookie and returns the user data",
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

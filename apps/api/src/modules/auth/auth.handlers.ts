import type { AppRouteHandler } from "@/types/index.types";
import type {
  ForgotPasswordRoute,
  LoginRoute,
  LogoutRoute,
  RegisterRoute,
  SendForgotPasswordEmailRoute,
  SendVerificationEmailRoute,
  VerifyEmailRoute,
} from "./auth.routes";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyEmail,
} from "@novelty/services/auth.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis, redlock } from "@novelty/redis";
import { emailQueue } from "@novelty/message-queue/queues/email.queue";
import { deleteCookie, setCookie } from "hono/cookie";
import env from "@/env";
import { SESSION_EXPIRATION_TIME } from "@novelty/services/session.service";

export const handleRegister: AppRouteHandler<RegisterRoute> = async (c) => {
  const body = c.req.valid("json");

  const result = await registerUser(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (result.success === false) {
    const error = result.error;
    return c.json({ message: error.message }, HttpStatusCodes[error.kind]);
  }

  const newUser = result.data;

  return c.json(
    {
      message:
        "Registration successful. Please verify your email to activate your account.",
      user: newUser,
    },
    HttpStatusCodes.CREATED,
  );
};

export const handleSendVerificationEmail: AppRouteHandler<
  SendVerificationEmailRoute
> = async (c) => {
  const body = c.req.valid("json");

  const res = await sendVerificationEmail(
    {
      dbInstance: db,
      redisClient: redis,
      redlockClient: redlock,
      messageQueueInstance: emailQueue,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  // Prevent pwning of the email
  if (res.success === false && res.error.kind === "NOT_FOUND") {
    return c.json(
      {
        message: "Email sent to the recipient",
        success: true,
      },
      HttpStatusCodes.OK,
    );
  }

  if (res.success === false && res.error.kind !== "NOT_FOUND") {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      message: "Email sent to the recipient",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

export const handleVerifyEmail: AppRouteHandler<VerifyEmailRoute> = async (
  c,
) => {
  const body = c.req.valid("json");

  const res = await verifyEmail(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      message: "Email verified",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

export const handleLogin: AppRouteHandler<LoginRoute> = async (c) => {
  const body = c.req.valid("json");

  const res = await loginUser(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  if (res.data) {
    const { token, expiresAt } = res.data;

    setCookie(c, "session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_EXPIRATION_TIME / 1000,
      expires: expiresAt,
    });
  }

  return c.json(
    {
      success: true,
      message: `Login successful`,
      user: res.data.user,
    },
    HttpStatusCodes.OK,
  );
};

export const handleLogout: AppRouteHandler<LogoutRoute> = async (c) => {
  const { userId, sessionId } = c.var.user;

  await logoutUser(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
    sessionId,
  );

  deleteCookie(c, "session");

  return c.json(
    {
      message: "Logout successful",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

export const handleSendForgotPasswordEmail: AppRouteHandler<
  SendForgotPasswordEmailRoute
> = async (c) => {
  const body = c.req.valid("json");

  const res = await sendForgotPasswordEmail(
    {
      dbInstance: db,
      redisClient: redis,
      redlockClient: redlock,
      messageQueueInstance: emailQueue,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      message: "Email sent to the recipient",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

export const handleForgotPasswordRoute: AppRouteHandler<
  ForgotPasswordRoute
> = async (c) => {
  const body = c.req.valid("json");

  const res = await forgotPassword(
    {
      dbInstance: db,
      redisClient: redis,
      redlockClient: redlock,
      messageQueueInstance: emailQueue,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  if (res.data) {
    const { token, expiresAt, user } = res.data;

    setCookie(c, "session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_EXPIRATION_TIME / 1000,
      expires: expiresAt,
    });

    return c.json(
      {
        message: "Password successfully reset",
        user,
      },
      HttpStatusCodes.OK,
    );
  }

  return c.json(
    {
      message:
        "Password successfully reset, please login with the new password",
    },
    HttpStatusCodes.OK,
  );
};

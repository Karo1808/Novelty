import env from "@/env";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import type { AppRouteHandler } from "@/types/index.types";
import { db } from "@novelty/db";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { emailQueue } from "@novelty/message-queue/queues/email.queue";
import { redis, redlock } from "@novelty/redis";
import {
  forgotPassword,
  initOAuth,
  loginUser,
  logoutUser,
  oAuthCallback,
  registerUser,
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyEmail,
} from "@novelty/services/auth.service";
import { OAUTH_COOKIE_EXPIRATION } from "@novelty/services/lib/config";
import { SESSION_EXPIRATION_TIME } from "@novelty/services/session.service";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { providers } from "./auth.providers";
import type {
  AuthMeRoute,
  ForgotPasswordRoute,
  LoginRoute,
  LogoutRoute,
  OAuthCallbackRoute,
  OAuthInitRoute,
  RegisterRoute,
  SendForgotPasswordEmailRoute,
  SendVerificationEmailRoute,
  VerifyEmailRoute,
} from "./auth.routes";
import type { OauthInitParams } from "./auth.validations";

export const handleAuthMe: AppRouteHandler<AuthMeRoute> = async (c) => {
  const { userId } = c.var.user;

  if (!userId) {
    return c.json(
      {
        message: "Unauthorized",
        success: false,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  return c.json(
    {
      userId,
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

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
    return c.json(
      { message: error.message, success: false },
      HttpStatusCodes[error.kind],
    );
  }

  const newUser = result.data;

  return c.json(
    {
      success: true,
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

export const handleOAuthInit: AppRouteHandler<OAuthInitRoute> = async (c) => {
  const provider = c.req.param("provider") as OauthInitParams["provider"];

  const res = await initOAuth(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
      providers,
    },
    provider,
  );

  if (res.success === false) {
    return c.json(
      {
        message:
          "The server is currently unable to handle the request. Please try again later.",
        success: false,
      },
      HttpStatusCodes["SERVICE_UNAVAILABLE"],
    );
  }

  if (res.data) {
    const { state, codeVerifier } = res.data;

    setCookie(c, "state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: OAUTH_COOKIE_EXPIRATION,
      expires: new Date(Date.now() + OAUTH_COOKIE_EXPIRATION),
    });

    setCookie(c, "code_verifier", codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: OAUTH_COOKIE_EXPIRATION,
      expires: new Date(Date.now() + OAUTH_COOKIE_EXPIRATION),
    });
  }

  return c.json(
    {
      url: res.data.redirectUrl,
      success: true,
    },
    HttpStatusCodes["OK"],
  );
};

export const handleOAuthCallback: AppRouteHandler<OAuthCallbackRoute> = async (
  c,
) => {
  const provider = c.req.param("provider") as OauthInitParams["provider"];

  const { state, code, error: oauthError } = c.req.query();

  const cookieState = getCookie(c, "state");
  const cookieCodeVerifier = getCookie(c, "code_verifier");

  const clientUrl = `${env.BASE_CLIENT_URL}`;
  const errorRedirect = (msg: string) =>
    `${clientUrl}/login?oauth_error=${encodeURIComponent(msg)}`;

  if (oauthError) {
    return c.redirect(errorRedirect(oauthError), HttpStatusCodes.FOUND);
  }

  if (
    !state ||
    !code ||
    !cookieState ||
    !cookieCodeVerifier ||
    state !== cookieState
  ) {
    return c.redirect(errorRedirect("invalid_request"), HttpStatusCodes.FOUND);
  }

  const res = await oAuthCallback(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
      providers,
    },
    {
      provider,
      codeVerifier: cookieCodeVerifier,
      code,
    },
  );

  if (res.success === false) {
    return c.redirect(
      errorRedirect(res.error.kind || "token_exchange_failed"),
      HttpStatusCodes.FOUND,
    );
  }

  if (res.data) {
    const { token, expiresAt } = res.data;

    deleteCookie(c, "state");
    deleteCookie(c, "code_verifier");

    setCookie(c, "session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_EXPIRATION_TIME / 1000,
      expires: expiresAt,
    });
  }

  return c.redirect(clientUrl, HttpStatusCodes.FOUND);
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
        success: true,
      },
      HttpStatusCodes.OK,
    );
  }

  return c.json(
    {
      message: "Password successfully reset",
      success: true,
    },
    HttpStatusCodes.OK,
  );
};

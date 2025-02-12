import type { AppRouteHandler } from "@/types/index.types";
import type {
  RegisterRoute,
  SendVerificationEmailRoute,
  VerifyEmailRoute,
} from "./auth.routes";
import {
  registerUser,
  sendVerificationEmail,
  verifyEmail,
} from "@novelty/services/auth.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import type { ServiceResponse } from "@novelty/services/types";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis } from "@novelty/redis";
import { emailQueue } from "@novelty/message-queue/queues/email.queue";

export const handleRegister: AppRouteHandler<RegisterRoute> = async (c) => {
  const body = c.req.valid("json");

  const res: ServiceResponse<keyof RegisterRoute["responses"]>
    = await registerUser<keyof RegisterRoute["responses"]>(
      {
        dbInstance: db,
        logger,
        prometheusRegistry,
        reqId: c.var.requestId,
      },
      body,
    );

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      { message: "An account with that email already exists." },
      HttpStatusCodes.CONFLICT,
    );
  }

  return c.json(
    {
      message:
        "Registration successful. Please verify your email to activate your account.",
      user: res.body,
    },
    HttpStatusCodes.CREATED,
  );
};

export const handleSendVerificationEmail: AppRouteHandler<
  SendVerificationEmailRoute
> = async (c) => {
  const body = c.req.valid("json");

  const res: ServiceResponse<keyof SendVerificationEmailRoute["responses"]>
    = await sendVerificationEmail<keyof SendVerificationEmailRoute["responses"]>(
      {
        dbInstance: db,
        redisClient: redis,
        messageQueueInstance: emailQueue,
        logger,
        prometheusRegistry,
        reqId: c.var.requestId,
      },
      body,
    );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "This email does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: res?.body?.message ?? "This email has already been verified",
        success: false,
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  return c.json(
    {
      message: "Email sent to the recipient",
      success: true,
      data: res.body,
    },
    HttpStatusCodes.OK,
  );
};

export const handleVerifyEmail: AppRouteHandler<VerifyEmailRoute> = async (
  c,
) => {
  const body = c.req.valid("json");

  const res: ServiceResponse<keyof VerifyEmailRoute["responses"]>
    = await verifyEmail<keyof VerifyEmailRoute["responses"]>(
      {
        dbInstance: db,
        redisClient: redis,
        logger,
        prometheusRegistry,
        reqId: c.var.requestId,
      },
      body,
    );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "User not found",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (res.status === HttpStatusCodes.BAD_REQUEST) {
    return c.json(
      {
        message: "The code is invalid or it has already expired",
        success: false,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: "This email has already been verified",
        success: false,
      },
      HttpStatusCodes.CONFLICT,
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

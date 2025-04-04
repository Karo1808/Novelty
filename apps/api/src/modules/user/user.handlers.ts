import type { AppRouteHandler } from "@/types/index.types";
import type {
  CompleteOnboardingRoute,
  GetPreferencesRoute,
  GetProfileRoute,
  GetUserDraftRoute,
  UpdatePreferencesRoute,
  UpdateProfileRoute,
  UpdateUserDraftRoute,
} from "./user.routes";
import {
  completeOnboarding,
  getPreferences,
  getProfile,
  getUserDraft,
  updatePreferences,
  updateProfile,
  updateUserDraft,
} from "@novelty/services/user.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis } from "@novelty/redis";
import { s3Client } from "@novelty/lib/s3-client";
import env from "@/env";

export const handleGetProfile: AppRouteHandler<GetProfileRoute> = async (c) => {
  const { userId } = c.var.user;

  const res = await getProfile<keyof GetProfileRoute["responses"]>(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(
    {
      userInfo: res.body,
    },
    HttpStatusCodes.OK,
  );
};

export const handleUpdateProfile: AppRouteHandler<UpdateProfileRoute> = async (
  c,
) => {
  const body = await c.req.parseBody({ dot: true });

  const username = body.username as string;
  const bio = body.bio as string;
  const profileImage = body.profileImage as File;

  const { userId: currentUserId } = c.var.user;

  const res = await updateProfile<keyof UpdateProfileRoute["responses"]>(
    {
      dbInstance: db,
      redisClient: redis,
      s3Client,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
      bucketName: env.R2_BUCKET_NAME,
    },
    {
      payload: {
        username,
        bio,
        profileImage,
      },
      userId: currentUserId,
    },
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: "Username is already taken",
        success: false,
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleGetPreferences: AppRouteHandler<
  GetPreferencesRoute
> = async (c) => {
  const { userId } = c.var.user;

  const res = await getPreferences<keyof GetPreferencesRoute["responses"]>(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(
    {
      userPreferences: res.body,
    },
    HttpStatusCodes.OK,
  );
};

export const handleUpdatePreferences: AppRouteHandler<
  UpdatePreferencesRoute
> = async (c) => {
  const body = c.req.valid("json");

  const { userId } = c.var.user;

  const res = await updatePreferences<
    keyof UpdatePreferencesRoute["responses"]
  >(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    {
      payload: body,
      userId,
    },
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleCompleteOnboarding: AppRouteHandler<
  CompleteOnboardingRoute
> = async (c) => {
  const { userId } = c.var.user;

  const res = await completeOnboarding<
    keyof CompleteOnboardingRoute["responses"]
  >(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    {
      userId,
    },
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: "User already onboarded",
        success: false,
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  if (res.status === HttpStatusCodes.BAD_REQUEST) {
    return c.json(
      {
        message: "Please provide all required information",
        success: false,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleGetUserDraft: AppRouteHandler<GetUserDraftRoute> = async (
  c,
) => {
  const { userId } = c.var.user;

  const res = await getUserDraft<keyof GetUserDraftRoute["responses"]>(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    {
      userId,
    },
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account information is missing",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: "Data is already cached",
        success: false,
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  return c.json(
    {
      userInfo: res?.body,
    },
    HttpStatusCodes.OK,
  );
};

export const handleUpdateUserDraft: AppRouteHandler<
  UpdateUserDraftRoute
> = async (c) => {
  const { userId } = c.var.user;
  const body = c.req.valid("json");

  await updateUserDraft<keyof UpdateUserDraftRoute["responses"]>(
    {
      dbInstance: db,
      redisClient: redis,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    {
      userId,
      payload: body,
    },
  );

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

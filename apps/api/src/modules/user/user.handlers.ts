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
import env from "@/env";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { db } from "@novelty/db";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { s3Client } from "@novelty/lib/s3-client";
import { redis } from "@novelty/redis";
import {
  completeOnboarding,
  getPreferences,
  getProfile,
  getUserDraft,
  updatePreferences,
  updateProfile,
  updateUserDraft,
} from "@novelty/services/user.service";

export const handleGetProfile: AppRouteHandler<GetProfileRoute> = async (c) => {
  const { userId } = c.var.user;

  const res = await getProfile(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
  );

  if (res.success === false) {
    return c.json(
      {
        success: false,
        message: res.error.message,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      success: true,
      userInfo: res.data,
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

  const res = await updateProfile(
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

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleGetPreferences: AppRouteHandler<
  GetPreferencesRoute
> = async (c) => {
  const { userId } = c.var.user;

  const res = await getPreferences(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
  );

  if (res.success === false) {
    return c.json(
      {
        success: false,
        message: res.error.message,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      success: true,
      userPreferences: res.data,
    },
    HttpStatusCodes.OK,
  );
};

export const handleUpdatePreferences: AppRouteHandler<
  UpdatePreferencesRoute
> = async (c) => {
  const body = c.req.valid("json");

  const { userId } = c.var.user;

  const res = await updatePreferences(
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

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleCompleteOnboarding: AppRouteHandler<
  CompleteOnboardingRoute
> = async (c) => {
  const { userId } = c.var.user;

  const res = await completeOnboarding(
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

  if (res.success === false) {
    return c.json(
      {
        message: res.error.message,
        success: false,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const handleGetUserDraft: AppRouteHandler<GetUserDraftRoute> = async (
  c,
) => {
  const { userId } = c.var.user;

  const res = await getUserDraft(
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
      userInfo: res.data,
    },
    HttpStatusCodes.OK,
  );
};

export const handleUpdateUserDraft: AppRouteHandler<
  UpdateUserDraftRoute
> = async (c) => {
  const { userId } = c.var.user;
  const body = c.req.valid("json");

  await updateUserDraft(
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

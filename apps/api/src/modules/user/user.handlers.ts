import type { AppRouteHandler } from "@/types/index.types";
import type { GetProfileRoute, UpdateProfileRoute } from "./user.routes";
import { getProfile, updateProfile } from "@novelty/services/user.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis } from "@novelty/redis";
import { s3Client } from "@novelty/lib/s3-client";

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

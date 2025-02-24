import type { SelectUserInfo } from "@novelty/db/schemas/user-info.schema";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import type { HttpStatusCodeValue } from "@novelty/lib/http-status-codes";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { ServiceDependencies, ServiceResponse } from "./types";
import {
  getIsUsernameUniqueQuery,
  getProfileByUserIdQuery,
  updateUserProfileByUserIdQuery,
} from "@novelty/db/queries/user.query";
import type { UpdateProfile } from "./lib/utils";
import { prepareDependencies } from "./lib/utils";
import { getUserByIdQuery } from "@novelty/db/queries/auth.query";
import { QueryExecutionError } from "@novelty/db/lib/errors";
import type { DrizzleError } from "drizzle-orm";
import { deleteFile, uploadFile } from "./file.service";
import { Buffer } from "node:buffer";

export const getProfile = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<
  ServiceResponse<TStatusCodes> & { body?: SelectUserInfo["profile"] }
> => {
  const userProfile = await getProfileByUserIdQuery(dependencies, userId);

  if (!userProfile) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    body: userProfile,
  };
};

export const updateProfile = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: {
    userId: string;
    payload: UpdateProfile;
  },
): Promise<ServiceResponse<TStatusCodes>> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");

  const { userId, payload } = body;
  const { username, profileImage, bio } = payload;

  const user = await getUserByIdQuery(dbDependencies, userId);

  if (!user) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  if (username) {
    const isUnique = await getIsUsernameUniqueQuery(dbDependencies, username);

    if (!isUnique) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }
  }

  let newAvatarUrl = null;

  if (profileImage) {
    const fileBuffer = Buffer.from(await profileImage.arrayBuffer());
    const fileType = profileImage.type;

    const filePath = `profile_pictures/${userId}-${Date.now()}.jpg`;

    newAvatarUrl = await uploadFile(
      filePath,
      fileBuffer,
      fileType,
      "novelty",
      dependencies.logger,
      dependencies.reqId,
    );

    const userProfile = await getProfileByUserIdQuery(dbDependencies, userId);

    if (userProfile?.avatarUrl) {
      await deleteFile(
        newAvatarUrl,
        "novelty",
        dependencies.logger,
        dependencies.reqId,
      );
    }
  }

  try {
    await updateUserProfileByUserIdQuery(
      dbDependencies,
      {
        username,
        avatarUrl: newAvatarUrl,
        bio,
      },
      userId,
    );
  }
  catch (error: unknown) {
    if (
      (error as DrizzleError).message.includes(
        "duplicate key value violates unique constraint",
      )
    ) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    throw new QueryExecutionError(
      "Failed to update user profile",
      error as Error,
    );
  }
  return { status: HttpStatusCodes.NO_CONTENT as TStatusCodes };
};

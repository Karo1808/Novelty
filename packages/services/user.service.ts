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
    const isUnique = await getIsUsernameUniqueQuery(
      dbDependencies,
      username,
      userId,
    );

    if (!isUnique) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }
  }

  let newAvatarUrl = null;

  if (profileImage) {
    const userProfile = await getProfileByUserIdQuery(dbDependencies, userId);

    if (userProfile?.avatarUrl) {
      await deleteFile({
        url: userProfile.avatarUrl,
        // eslint-disable-next-line node/no-process-env
        bucketName: process.env.R2_BUCKET_NAME!,
        dependencies: {
          client: dependencies.s3Client!,
          reqId: dependencies.reqId,
          logger: dependencies.logger,
        },
      });
    }

    const fileBuffer = Buffer.from(await profileImage.arrayBuffer());
    const fileType = profileImage.type;

    const filePath = `profile_pictures/${userId}.jpg`;

    newAvatarUrl = await uploadFile({
      filename: filePath,
      fileBuffer,
      fileType,
      // eslint-disable-next-line node/no-process-env
      bucketName: process.env.R2_BUCKET_NAME!,
      dependencies: {
        client: dependencies.s3Client!,
        reqId: dependencies.reqId,
        logger: dependencies.logger,
      },
    });
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
    if (newAvatarUrl) {
      await deleteFile({
        url: newAvatarUrl,
        // eslint-disable-next-line node/no-process-env
        bucketName: process.env.R2_BUCKET_NAME!,
        dependencies: {
          client: dependencies.s3Client!,
          reqId: dependencies.reqId,
          logger: dependencies.logger,
        },
      });
    }
    throw new QueryExecutionError(
      "Failed to update user profile",
      error as Error,
    );
  }
  return { status: HttpStatusCodes.NO_CONTENT as TStatusCodes };
};

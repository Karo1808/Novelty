import type {
  SelectUserInfo,
  UpdateUserInfo,
} from "@novelty/db/schemas/user-info.schema";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import type { HttpStatusCodeValue } from "@novelty/lib/http-status-codes";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { ServiceDependencies, ServiceResponse } from "./types";
import {
  getIsUsernameUniqueQuery,
  getPreferencesByUserIdQuery,
  getProfileByUserIdQuery,
  getUserInfoQuery,
  updateUserPreferencesByIdQuery,
  updateUserProfileByUserIdQuery,
} from "@novelty/db/queries/user.query";
import type { UpdateProfile } from "./lib/utils";
import { prepareDependencies } from "./lib/utils";
import {
  getUserByIdQuery,
  updateUserByIdQuery,
} from "@novelty/db/queries/auth.query";
import { QueryExecutionError } from "@novelty/db/lib/errors";
import { deleteFile, uploadFile } from "./file.service";
import { Buffer } from "node:buffer";
import { getByKeyJson, setByKeyJson } from "@novelty/redis/queries/json.query";
import {
  MIN_REQUIRED_GENRES,
  PROFILE_PICTURES_PATH_PREFIX,
  USER_INFO_DRAFT_KEY,
} from "./lib/config";
import { doesKeyExists } from "@novelty/redis/queries/index.query";
import type { UserDraftBodySchema } from "@novelty/lib/validations/user";

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
        dependencies: {
          client: dependencies.s3Client!,
          reqId: dependencies.reqId,
          logger: dependencies.logger,
          bucketName: dependencies.bucketName!,
        },
      });
    }

    const fileBuffer = Buffer.from(await profileImage.arrayBuffer());
    const fileType = profileImage.type;
    const fileExtension = fileType.split("/")[1] || "jpg";
    const uniqueFilename = `${PROFILE_PICTURES_PATH_PREFIX}${userId}-${Date.now()}.${fileExtension}`;

    newAvatarUrl = await uploadFile({
      filename: uniqueFilename,
      fileBuffer,
      fileType,
      dependencies: {
        client: dependencies.s3Client!,
        reqId: dependencies.reqId,
        logger: dependencies.logger,
        bucketName: dependencies.bucketName!,
      },
    });
  }

  try {
    await updateUserProfileByUserIdQuery(
      dbDependencies,
      {
        ...(username !== undefined && { username }),
        ...(newAvatarUrl !== null && { avatarUrl: newAvatarUrl }),
        ...(bio !== undefined && { bio }),
      },
      userId,
    );
  }
  catch (error: unknown) {
    if (newAvatarUrl) {
      await deleteFile({
        url: newAvatarUrl,
        dependencies: {
          client: dependencies.s3Client!,
          reqId: dependencies.reqId,
          logger: dependencies.logger,
          bucketName: dependencies.bucketName!,
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

export const getPreferences = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<
  ServiceResponse<TStatusCodes> & { body?: SelectUserInfo["preferences"] }
> => {
  const res = await getPreferencesByUserIdQuery(dependencies, userId);

  if (!res?.preferences) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  const userPreferences = res.preferences as SelectUserInfo["preferences"];

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    body: userPreferences,
  };
};

export const updatePreferences = async <
  TStatusCodes extends HttpStatusCodeValue,
>(
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: {
    userId: string;
    payload: UpdateUserInfo["preferences"];
  },
): Promise<ServiceResponse<TStatusCodes>> => {
  const { userId, payload } = body;

  const user = await getUserByIdQuery(dependencies, userId);

  if (!user) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  try {
    await updateUserPreferencesByIdQuery(dependencies, payload, userId);
  }
  catch (error: unknown) {
    throw new QueryExecutionError(
      "Failed to update user preferences",
      error as Error,
    );
  }

  return { status: HttpStatusCodes.NO_CONTENT as TStatusCodes };
};

export const completeOnboarding = async <
  TStatusCodes extends HttpStatusCodeValue,
>(
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: {
    userId: string;
  },
): Promise<ServiceResponse<TStatusCodes>> => {
  const { userId } = body;

  const user = await getUserInfoQuery(dependencies, userId);

  if (!user) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  if (user.isOnboarded) {
    return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
  }

  const preferences = user.userInfo
    ?.preferences as SelectUserInfo["preferences"];

  if (
    !user.isEmailVerified
    || !user.userInfo?.username
    || !preferences.genres
    || preferences.genres?.length < MIN_REQUIRED_GENRES
  ) {
    return { status: HttpStatusCodes.BAD_REQUEST as TStatusCodes };
  }

  await updateUserByIdQuery(dependencies, { isOnboarded: true }, userId);

  return { status: HttpStatusCodes.NO_CONTENT as TStatusCodes };
};

export const getUserDraft = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: ServiceDependencies,
  body: {
    userId: string;
  },
): Promise<ServiceResponse<TStatusCodes> & { body?: SelectUserInfo }> => {
  const { userId } = body;
  const redisKey = `${USER_INFO_DRAFT_KEY}:${userId}`;

  const user = await getUserInfoQuery(dependencies, userId);

  if (!user || !user.userInfo) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  let userInfo = await getByKeyJson(dependencies, redisKey);

  if (!userInfo) {
    const isCached = await doesKeyExists(dependencies, redisKey);

    if (isCached) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    await setByKeyJson(dependencies, redisKey, user.userInfo);

    [userInfo] = await getByKeyJson(dependencies, redisKey);
  }

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    body: userInfo,
  };
};

export const updateUserDraft = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: ServiceDependencies,
  body: {
    userId: string;
    payload: UserDraftBodySchema;
  },
): Promise<ServiceResponse<TStatusCodes>> => {
  const { userId, payload } = body;

  const redisKey = `${USER_INFO_DRAFT_KEY}:${userId}`;

  await setByKeyJson(dependencies, redisKey, payload);

  return {
    status: HttpStatusCodes.NO_CONTENT as TStatusCodes,
  };
};

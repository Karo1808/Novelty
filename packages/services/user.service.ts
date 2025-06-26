import { QueryExecutionError } from "@novelty/db/lib/errors";
import { SelectUserWithInfo } from "@novelty/db/lib/types";
import {
  getUserByIdQuery,
  updateUserByIdQuery,
} from "@novelty/db/queries/auth.query";
import {
  getIsUsernameUniqueQuery,
  getPreferencesByUserIdQuery,
  getProfileByUserIdQuery,
  getUserInfoQuery,
  updateUserPreferencesByIdQuery,
  updateUserProfileByUserIdQuery,
} from "@novelty/db/queries/user.query";
import type {
  SelectUserInfo,
  UpdateUserInfo,
} from "@novelty/db/schemas/user-info.schema";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { UserDraftBodySchema } from "@novelty/lib/validations/user";
import { doesKeyExists } from "@novelty/redis/queries/index.query";
import { getByKeyJson, setByKeyJson } from "@novelty/redis/queries/json.query";
import { Buffer } from "node:buffer";
import { deleteFile, uploadFile } from "./file.service";
import {
  MIN_REQUIRED_GENRES,
  PROFILE_PICTURES_PATH_PREFIX,
  USER_INFO_DRAFT_KEY,
} from "./lib/config";
import type { UpdateProfile } from "./lib/utils";
import type { ErrorResponse, Result, ServiceDependencies } from "./types";

export type GetUserError = ErrorResponse<"NOT_FOUND">;

export const getUser = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<Result<SelectUserWithInfo, GetUserError>> => {
  const userData = await getUserInfoQuery(dependencies, "id", userId);

  if (!userData || !userData.userInfo) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "User not found",
      },
    };
  }

  return {
    success: true,
    data: {
      id: userId,
      email: userData.email,
      isEmailVerified: userData.isEmailVerified,
      isOnboarded: userData.isOnboarded,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      userInfo: {
        profile: {
          avatarUrl: userData.userInfo.avatarUrl,
          bio: userData.userInfo.bio,
          username: userData.userInfo.username,
        },
        // @ts-expect-error: 'preferences is json'
        preferences: userData.userInfo.preferences,
      },
    },
  };
};

export type GetProfileError = ErrorResponse<"NOT_FOUND">;

export const getProfile = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<Result<SelectUserInfo["profile"], GetProfileError>> => {
  const userProfile = await getProfileByUserIdQuery(dependencies, userId);

  if (!userProfile) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "No user profile found",
      },
    };
  }

  return {
    success: true,
    data: userProfile,
  };
};

export type UpdateProfileError =
  | ErrorResponse<"NOT_FOUND">
  | ErrorResponse<"CONFLICT">;

export const updateProfile = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: {
    userId: string;
    payload: UpdateProfile;
  },
): Promise<Result<void, UpdateProfileError>> => {
  const { userId, payload } = body;
  const { username, profileImage, bio } = payload;

  const user = await getUserByIdQuery(dependencies, userId);

  if (!user) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "Account does not exist",
      },
    };
  }

  if (username) {
    const isUnique = await getIsUsernameUniqueQuery(
      dependencies,
      username,
      userId,
    );

    if (!isUnique) {
      return {
        success: false,
        error: {
          kind: "CONFLICT",
          message: "Username already exists",
        },
      };
    }
  }

  let newAvatarUrl = null;

  if (profileImage) {
    const userProfile = await getProfileByUserIdQuery(dependencies, userId);

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
      dependencies,
      {
        ...(username !== undefined && { username }),
        ...(newAvatarUrl !== null && { avatarUrl: newAvatarUrl }),
        ...(bio !== undefined && { bio }),
      },
      userId,
    );
  } catch (error: unknown) {
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

  return {
    success: true,
    data: undefined,
  };
};

export type GetPreferencesError = ErrorResponse<"NOT_FOUND">;

export const getPreferences = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<Result<SelectUserInfo["preferences"], GetPreferencesError>> => {
  const res = await getPreferencesByUserIdQuery(dependencies, userId);

  if (!res?.preferences) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "No user preferences found",
      },
    };
  }

  const userPreferences = res.preferences as SelectUserInfo["preferences"];

  return {
    success: true,
    data: userPreferences,
  };
};

export type UpdatePreferencesError =
  | ErrorResponse<"NOT_FOUND">
  | ErrorResponse<"CONFLICT">;

export const updatePreferences = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: {
    userId: string;
    payload: UpdateUserInfo["preferences"];
  },
): Promise<Result<void, UpdatePreferencesError>> => {
  const { userId, payload } = body;

  const user = await getUserByIdQuery(dependencies, userId);

  if (!user) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "Account does not exist",
      },
    };
  }

  try {
    await updateUserPreferencesByIdQuery(dependencies, payload, userId);
  } catch (error: unknown) {
    throw new QueryExecutionError(
      "Failed to update user preferences",
      error as Error,
    );
  }

  return {
    success: true,
    data: undefined,
  };
};

export type CompleteOnboardingError =
  | ErrorResponse<"NOT_FOUND">
  | ErrorResponse<"CONFLICT">
  | ErrorResponse<"BAD_REQUEST">;

export const completeOnboarding = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: {
    userId: string;
  },
): Promise<Result<void, CompleteOnboardingError>> => {
  const { userId } = body;

  const user = await getUserInfoQuery(dependencies, "id", userId);

  if (!user) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "Account does not exist",
      },
    };
  }

  if (user.isOnboarded) {
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "User is already onboarded",
      },
    };
  }

  const preferences = user.userInfo
    ?.preferences as SelectUserInfo["preferences"];

  if (
    !user.isEmailVerified ||
    !user.userInfo?.username ||
    !preferences.genres ||
    preferences.genres?.length < MIN_REQUIRED_GENRES
  ) {
    return {
      success: false,
      error: {
        kind: "BAD_REQUEST",
        message: "User is not ready to be onboarded",
      },
    };
  }

  await updateUserByIdQuery(dependencies, { isOnboarded: true }, userId);

  return {
    success: true,
    data: undefined,
  };
};

export type GetUserDraftError =
  | ErrorResponse<"NOT_FOUND">
  | ErrorResponse<"CONFLICT">;

export const getUserDraft = async (
  dependencies: ServiceDependencies,
  body: {
    userId: string;
  },
): Promise<Result<SelectUserInfo, GetUserDraftError>> => {
  const { userId } = body;
  const redisKey = `${USER_INFO_DRAFT_KEY}:${userId}`;

  const user = await getUserInfoQuery(dependencies, "id", userId);

  if (!user || !user.userInfo) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "Account information is missing",
      },
    };
  }

  let userInfo = await getByKeyJson(dependencies, redisKey);

  if (!userInfo) {
    const isCached = await doesKeyExists(dependencies, redisKey);

    if (isCached) {
      return {
        success: false,
        error: {
          kind: "CONFLICT",
          message: "User profile draft already exists",
        },
      };
    }

    await setByKeyJson(dependencies, redisKey, user.userInfo);

    [userInfo] = await getByKeyJson(dependencies, redisKey);
  }

  return {
    success: true,
    data: userInfo,
  };
};

export const updateUserDraft = async (
  dependencies: ServiceDependencies,
  body: {
    userId: string;
    payload: UserDraftBodySchema;
  },
) => {
  const { userId, payload } = body;

  const redisKey = `${USER_INFO_DRAFT_KEY}:${userId}`;

  await setByKeyJson(dependencies, redisKey, payload);
};

import type { SelectUserWithInfo } from "@novelty/db/lib/types";
import type { SelectAuthProvider } from "@novelty/db/schemas/auth-provider.schema";
import type { InsertUser, SelectUser } from "@novelty/db/schemas/user.schema";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type {
  ForgotPasswordBodySchema,
  OAuthIdTokenSchema,
  VerifyEmailBodySchema,
} from "@novelty/lib/validations/auth";
import type { ErrorResponse, Result, ServiceDependencies } from "./types";
import { QueryExecutionError } from "@novelty/db/lib/errors";
import {
  createProvider,
  createUserQuery,
  getProvidersByProviderUserId,
  getUserByEmailQuery,
  getUserByIdQuery,
  updateUserByIdQuery,
} from "@novelty/db/queries/auth.query";
import {
  getUserInfoQuery,
  updateUserProfileByUserIdQuery,
} from "@novelty/db/queries/user.query";
import {
  encodeToken,
  generatePasswordResetToken,
  hashString,
  verifyHash,
} from "@novelty/lib/auth/cryptography";
import { generateVerificationToken } from "@novelty/lib/generate-verification-token";
import { captureException } from "@novelty/lib/sentry";
import { oauthIdTokenSchema } from "@novelty/lib/validations/auth";
import { addJobToQueue } from "@novelty/message-queue/lib/add-job-to-queue";
import { EnqueuingError } from "@novelty/message-queue/lib/error";
import {
  acquireLock,
  deleteByKey,
  getByKey,
  hexistsQuery,
  releaseLock,
  setWithExpiry,
} from "@novelty/redis/queries/index.query";
import {
  decodeIdToken,
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import {
  AMAZON_SCOPES,
  BLACKLIST_KEY,
  DUMMY_PASSWORD_HASH,
  EMAIL_QUEUE_COMPLETED_JOBS_LIMIT,
  EMAIL_QUEUE_COMPLETED_JOBS_TIME,
  EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
  EMAIL_QUEUE_REMOVED_JOBS_TIME,
  FORGOT_PASSWORD_EMAIL_EXPIRY_TIME,
  GOOGLE_SCOPES,
  LOCK_TTL,
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "./lib/config";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
  invalidateSession,
} from "./session.service";

export type RegisterUserError = ErrorResponse<"CONFLICT">;

export const registerUser = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  body: InsertUser["register"],
): Promise<Result<SelectUser, RegisterUserError>> => {
  const existingUser = await getUserByEmailQuery(dependencies, body.email);

  if (existingUser) {
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "An account with that email already exists.",
      },
    };
  }

  const hashedPassword = await hashString(body.password as string);

  try {
    const newUser = await createUserQuery(
      dependencies,
      {
        email: body.email,
        password: hashedPassword,
      },
      "email",
    );

    if (!newUser || typeof newUser !== "object") {
      throw new QueryExecutionError("Failed to create user.");
    }

    return {
      success: true,
      data: newUser,
    };
  }
  catch (err: any) {
    if (
      err?.message
      && err.message.includes("duplicate key value violates unique constraint")
    ) {
      return {
        success: false,
        error: {
          kind: "CONFLICT",
          message: "An account with that email already exists.",
        },
      };
    }

    throw err;
  }
};

export type SendVerificationEmailError =
  | ErrorResponse<"CONFLICT">
  | ErrorResponse<"NOT_FOUND">;

export const sendVerificationEmail = async (
  dependencies: Required<
    Omit<ServiceDependencies, "s3Client" | "bucketName" | "providers">
  >,
  body: InsertUser["sendEmail"],
): Promise<Result<undefined, SendVerificationEmailError>> => {
  const lockKey = `lock:send-email-verification:${body.email}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(dependencies, lockKey, ttl);

  if (!lock) {
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "Another process is already handling this email",
      },
    };
  }
  try {
    const user = await getUserByEmailQuery(dependencies, body.email!);

    if (!user) {
      dependencies.logger.error({
        message: "User not found",
        source: "sendVerificationEmail",
        email: body.email,
        reqId: dependencies.reqId,
      });
      return {
        success: false,
        error: {
          kind: "NOT_FOUND",
          message: "User not found",
        },
      };
    }

    const isVerified = user.isEmailVerified;

    const token = generateVerificationToken(VERIFICATION_EMAIL_TOKEN_LENGTH);

    const redisKey = `verify-email:${user.email}`;

    await setWithExpiry(
      dependencies,
      redisKey,
      token,
      VERIFICATION_EMAIL_EXPIRY_TIME,
    );

    try {
      if (!isVerified) {
        await addJobToQueue(
          dependencies.messageQueueInstance!,
          "send-verification-email",
          {
            email: body.email,
            token,
          },
          {
            jobId: dependencies.reqId,
            removeOnComplete: {
              age: EMAIL_QUEUE_COMPLETED_JOBS_TIME,
              count: EMAIL_QUEUE_COMPLETED_JOBS_LIMIT,
            },
            removeOnFail: {
              age: EMAIL_QUEUE_REMOVED_JOBS_TIME,
              count: EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
            },
          },
        );
      }
      else {
        await deleteByKey(dependencies, redisKey);
      }
    }
    catch (err: unknown) {
      await deleteByKey(dependencies, redisKey);
      throw new EnqueuingError("send-verification-email", err as Error);
    }

    return {
      success: true,
      data: undefined,
    };
  }
  finally {
    if (lock) {
      await releaseLock(dependencies, lock);
    }
  }
};

export type VerifyEmailError =
  | ErrorResponse<"CONFLICT">
  | ErrorResponse<"NOT_FOUND">
  | ErrorResponse<"BAD_REQUEST">;

export const verifyEmail = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: VerifyEmailBodySchema,
): Promise<Result<undefined, VerifyEmailError>> => {
  const { email, verificationCode } = body;

  const key = `verify-email:${email}`;

  const redisVerificationCode = await getByKey(dependencies, key);

  if (!redisVerificationCode || redisVerificationCode !== verificationCode) {
    return {
      success: false,
      error: {
        kind: "BAD_REQUEST",
        message: "The code is incorrect or it has already expired",
      },
    };
  }

  const queryResult = await getUserByEmailQuery(dependencies, email);

  if (queryResult === undefined || !queryResult) {
    return {
      success: false,
      error: {
        kind: "NOT_FOUND",
        message: "User with that email does not exist",
      },
    };
  }

  if (queryResult.isEmailVerified) {
    await deleteByKey(dependencies, key);
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "Email already verified",
      },
    };
  }

  const userId = queryResult.id;

  const [updatedUser] = await updateUserByIdQuery(
    dependencies,
    { isEmailVerified: true },
    userId,
  );

  if (updatedUser?.isEmailVerified === false || !updatedUser) {
    throw new QueryExecutionError("Failed to update user");
  }

  await deleteByKey(dependencies, key);

  return {
    success: true,
    data: undefined,
  };
};

export interface AuthenticatedSessionResponseData {
  user: SelectUserWithInfo;
  token: string;
  expiresAt: Date;
}

export const createAuthenticatedSessionResponse = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "messageQueueInstance">,
  userId: string,
): Promise<AuthenticatedSessionResponseData> => {
  const sessionToken = generateSessionToken();
  const { expiresAt } = await createSession(dependencies, sessionToken, userId);

  const fullUserInfo = await getUserInfoQuery(dependencies, "id", userId);
  if (!fullUserInfo || !fullUserInfo.userInfo) {
    dependencies.logger.error({
      message: "User info not found after successful authentication step",
      source: "createAuthenticatedSessionResponse",
      userId,
      reqId: dependencies.reqId,
    });

    throw new QueryExecutionError("User info missing for authenticated user.");
  }

  return {
    user: {
      id: userId,
      email: fullUserInfo.email,
      isEmailVerified: fullUserInfo.isEmailVerified,
      isOnboarded: fullUserInfo.isOnboarded,
      userInfo: {
        profile: {
          avatarUrl: fullUserInfo.userInfo.avatarUrl,
          bio: fullUserInfo.userInfo.bio,
          username: fullUserInfo.userInfo.username,
        },
        // @ts-expect-error: 'preferences is json'
        preferences: fullUserInfo.userInfo.preferences,
      },
    },
    token: sessionToken,
    expiresAt,
  };
};

export type LoginUserError =
  | ErrorResponse<"UNAUTHORIZED">
  | ErrorResponse<"FORBIDDEN">;

export const loginUser = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "messageQueueInstance">,
  body: InsertUser["login"],
): Promise<Result<AuthenticatedSessionResponseData, LoginUserError>> => {
  const { email, password } = body;

  // TODO: update to include provider check

  const user = await getUserByEmailQuery(dependencies, email, true);

  const isBlacklisted = await hexistsQuery(
    dependencies,
    BLACKLIST_KEY,
    user?.id ?? "",
  );

  if (isBlacklisted) {
    dependencies.logger.warn({
      message: "Login attempt from blacklisted user",
      source: "loginUser",
      email,
      reqId: dependencies.reqId,
    });

    return {
      success: false,
      error: {
        kind: "FORBIDDEN",
        message: "Access denied (e.g., account banned, inactive)",
      },
    };
  }

  let passwordMatch = false;

  if (user) {
    passwordMatch = await verifyHash(password, user.password);
  }
  else {
    try {
      await verifyHash(password, DUMMY_PASSWORD_HASH);
    }
    catch (dummyError: unknown) {
      dependencies.logger.debug({
        message: "Ignored expected error during dummy password check",
        source: "loginUser",
        email,
        reqId: dependencies.reqId,
        dummyError,
      });
    }
  }

  if (!passwordMatch) {
    dependencies.logger.warn({
      message: "Invalid credentials",
      source: "loginUser",
      reqId: dependencies.reqId,
    });

    return {
      success: false,
      error: {
        kind: "UNAUTHORIZED",
        message: "Invalid credentials",
      },
    };
  }

  if (!user) {
    dependencies.logger.error({
      message: "Password matched but user not found",
      source: "loginUser",
      email,
      reqId: dependencies.reqId,
    });
    throw new QueryExecutionError("User data inconsistency during login.");
  }

  const sessionData = await createAuthenticatedSessionResponse(
    dependencies,
    user.id,
  );

  return {
    success: true,
    data: sessionData,
  };
};

interface InitOAuthSuccess {
  redirectUrl: string;
  state: string;
  codeVerifier: string;
}
type InitOAuthError = ErrorResponse<"BAD_REQUEST">;

export const initOAuth = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance", "dbInstance"]
  >,
  provider: SelectAuthProvider["provider"],
): Promise<Result<InitOAuthSuccess, InitOAuthError>> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  let authorizationURL: URL;

  const providers = dependencies.providers!;

  switch (provider) {
    case "google":
      authorizationURL = providers.google.createAuthorizationURL(
        state,
        codeVerifier,
        GOOGLE_SCOPES,
      );
      break;
    case "amazon":
      authorizationURL = providers.amazon.createAuthorizationURL(
        state,
        codeVerifier,
        AMAZON_SCOPES,
      );
      break;
    default:
      dependencies.logger.error({
        message: "Unexpected OAuth provider requested",
        provider,
        reqId: dependencies.reqId,
      });
      return {
        success: false,
        error: { kind: "BAD_REQUEST", message: "Invalid provider specified." },
      };
  }
  return {
    success: true,
    data: { redirectUrl: authorizationURL.toString(), state, codeVerifier },
  };
};

export const authenticateOAuthUser = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  provider: SelectAuthProvider["provider"],
  claims: OAuthIdTokenSchema,
): Promise<AuthenticatedSessionResponseData> => {
  const existingProvider = await getProvidersByProviderUserId(
    dependencies,
    provider,
    claims.sub,
  );

  let userId = existingProvider?.userId;

  let existingUser = null;

  if (!userId) {
    existingUser = await getUserByEmailQuery(dependencies, claims.email);
    userId = existingUser?.id;
  }
  if (!existingUser) {
    const newUser = await createUserQuery(
      dependencies,
      {
        email: claims.email,
      },
      provider,
    );
    userId = newUser?.id;

    await updateUserByIdQuery(
      dependencies,
      { isEmailVerified: claims.email_verified },
      userId!,
    );

    await updateUserProfileByUserIdQuery(
      dependencies,
      { username: claims.name, avatarUrl: claims.picture },
      userId!,
    );
  }

  if (existingUser) {
    await createProvider(dependencies, {
      provider,
      providerUserId: claims.sub,
      userId: userId!,
    });
  }

  const sessionData = await createAuthenticatedSessionResponse(
    dependencies,
    userId!,
  );

  return sessionData;
};

type OAuthcallbackError =
  | ErrorResponse<"UNAUTHORIZED">
  | ErrorResponse<"BAD_REQUEST">;

export const oAuthCallback = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: {
    provider: SelectAuthProvider["provider"];
    codeVerifier: string;
    code: string;
  },
): Promise<Result<AuthenticatedSessionResponseData, OAuthcallbackError>> => {
  const { provider, codeVerifier, code } = body;
  const providers = dependencies.providers!;

  let claims;

  try {
    switch (provider) {
      case "google": {
        const tokens = await providers.google.validateAuthorizationCode(
          code,
          codeVerifier,
        );
        const idToken = tokens.idToken();
        claims = decodeIdToken(idToken);
        break;
      }
      // TODO: Update the amazon app once I have a client deployed
      case "amazon": {
        const tokens = await providers.amazon.validateAuthorizationCode(
          code,
          codeVerifier,
        );
        const idToken = tokens.idToken();
        claims = decodeIdToken(idToken);
        break;
      }
      default:
        dependencies.logger.error({
          message: "Unexpected OAuth provider requested",
          provider,
          reqId: dependencies.reqId,
        });
        return {
          success: false,
          error: {
            kind: "BAD_REQUEST",
            message: "Invalid provider specified.",
          },
        };
    }
  }
  catch (error) {
    if (error instanceof OAuth2RequestError) {
      dependencies.logger.error({
        message: "Failed to validate authorization code",
        source: "oAuthCallback",
        provider,
        error,
        reqId: dependencies.reqId,
      });
    }
    return {
      success: false,
      error: {
        kind: "UNAUTHORIZED",
        message: "Failed to validate authorization code",
      },
    };
  }

  try {
    claims = oauthIdTokenSchema.parse(claims);

    const response = await authenticateOAuthUser(
      dependencies,
      provider,
      claims,
    );

    return {
      success: true,
      data: response,
    };
  }
  catch (error: unknown) {
    dependencies.logger.fatal({
      message:
        "[FATAL ERROR]: The parsed output for auth provider user information did not match the schema",
      source: "oAuthCallback",
      provider,
      error,
      reqId: dependencies.reqId,
    });

    captureException({
      error: error as Error,
      tags: [{ name: "requestId", value: dependencies.reqId }],
      breadcrumb: {
        category: "service function",
        message: (error as Error).message,
        level: "fatal",
      },
      contextName: "oAuthCallback",
      context: { serviceFunction: "oAuthCallback" },
    });

    throw error;
  }
};

export const logoutUser = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance", "dbInstance"]
  >,
  userId: string,
  sessionId: string,
) => {
  await invalidateSession(dependencies, sessionId, userId);
};

export type SendForgotPasswordEmailError =
  | ErrorResponse<"CONFLICT">
  | ErrorResponse<"FORBIDDEN">;

export const sendForgotPasswordEmail = async (
  dependencies: Required<
    Omit<ServiceDependencies, "s3Client" | "bucketName" | "providers">
  >,
  body: InsertUser["sendEmail"],
): Promise<Result<undefined, SendForgotPasswordEmailError>> => {
  const { email } = body;

  const lockKey = `lock:send-forgot-password-email:${email}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(dependencies, lockKey, ttl);

  if (!lock) {
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "Password reset request already in progress for this email.",
      },
    };
  }

  try {
    const user = await getUserByEmailQuery(dependencies, email!);

    const isBlacklisted = await hexistsQuery(
      dependencies,
      BLACKLIST_KEY,
      user?.id ?? "",
    );

    if (isBlacklisted) {
      dependencies.logger.warn({
        message: "Password reset attempt from blacklisted user",
        source: "sendForgotPasswordEmail",
        email,
        reqId: dependencies.reqId,
      });

      return {
        success: false,
        error: {
          kind: "FORBIDDEN",
          message: "Access denied (e.g., account banned, inactive)",
        },
      };
    }

    const { rawToken, hashedToken } = generatePasswordResetToken();
    const redisKey = `forgot-password:${hashedToken}`;

    if (user) {
      await setWithExpiry(
        dependencies,
        redisKey,
        user.id,
        FORGOT_PASSWORD_EMAIL_EXPIRY_TIME,
      );

      try {
        await addJobToQueue(
          dependencies.messageQueueInstance!,
          "send-forgot-password-email",
          {
            email: user.email,
            token: rawToken,
          },
          {
            jobId: dependencies.reqId,
            removeOnComplete: {
              age: EMAIL_QUEUE_COMPLETED_JOBS_TIME,
              count: EMAIL_QUEUE_COMPLETED_JOBS_LIMIT,
            },
            removeOnFail: {
              age: EMAIL_QUEUE_REMOVED_JOBS_TIME,
              count: EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
            },
          },
        );
      }
      catch (err: unknown) {
        deleteByKey(dependencies, redisKey);
        throw new EnqueuingError("send-forgot-password-email", err as Error);
      }
    }
    else {
      const dummyValue = "dummy_user_not_found";

      try {
        await setWithExpiry(
          dependencies,
          redisKey,
          dummyValue,
          FORGOT_PASSWORD_EMAIL_EXPIRY_TIME,
        );
      }
      catch (redisErr: unknown) {
        dependencies.logger.warn({
          message:
            "Error during dummy Redis write for timing attack mitigation",
          source: "sendForgotPasswordEmail",
          email,
          redisKey,
          reqId: dependencies.reqId,
          error: redisErr,
        });
      }
    }

    return {
      success: true,
      data: undefined,
    };
  }
  finally {
    await releaseLock(dependencies, lock);
  }
};

type ForgotPasswordError =
  | ErrorResponse<"BAD_REQUEST">
  | ErrorResponse<"CONFLICT">;

export const forgotPassword = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: ForgotPasswordBodySchema,
): Promise<
  Result<undefined | AuthenticatedSessionResponseData, ForgotPasswordError>
> => {
  const { newPassword, token: rawToken } = body;

  const hashedToken = encodeToken(rawToken);
  const redisKey = `forgot-password:${hashedToken}`;

  const lockKey = `forgot-password-lock:${hashedToken}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(dependencies, lockKey, ttl);

  if (!lock) {
    return {
      success: false,
      error: {
        kind: "CONFLICT",
        message: "Password reset request already in progress.",
      },
    };
  }

  try {
    const userId = await getByKey(dependencies, redisKey);

    if (!userId) {
      return {
        success: false,
        error: {
          kind: "BAD_REQUEST",
          message: "Invalid or expired password reset token.",
        },
      };
    }

    const user = await getUserByIdQuery(dependencies, userId);

    if (!user) {
      await deleteByKey(dependencies, redisKey);

      return {
        success: false,
        error: {
          kind: "BAD_REQUEST",
          message: "Invalid or expired password reset token.",
        },
      };
    }

    const newPasswordHash = await hashString(newPassword);

    await updateUserByIdQuery(
      dependencies,
      { password: newPasswordHash },
      user.id,
    );

    try {
      await deleteByKey(dependencies, redisKey);

      await invalidateAllSessions(dependencies, user.id);

      const sessionData = await createAuthenticatedSessionResponse(
        dependencies,
        user.id,
      );

      return {
        success: true,
        data: sessionData,
      };
    }
    catch (redisOrSessionError) {
      dependencies.logger.error({
        message:
          "Password reset successful, but failed during Redis cleanup or new session creation",
        source: "forgotPassword",

        userId: user.id,
        reqId: dependencies.reqId,
        error: redisOrSessionError,
      });
      return {
        success: true,
        data: undefined,
      };
    }
  }
  finally {
    if (lock) {
      await releaseLock(dependencies, lock);
    }
  }
};

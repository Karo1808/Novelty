import type { ServiceDependencies, ServiceResponse } from "./types";
import type { InsertUser, SelectUser } from "@novelty/db/schemas/user.schema";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
  getUserByIdQuery,
  updateUserByIdQuery,
} from "@novelty/db/queries/auth.query";
import {
  constantTimeCompare,
  decryptString,
  encodeToken,
  encryptString,
  generatePasswordResetToken,
  hashString,
  verifyHash,
} from "@novelty/lib/auth/cryptography";
import { QueryExecutionError } from "@novelty/db/lib/errors";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import { prepareDependencies } from "./lib/utils";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import type { HttpStatusCodeValue } from "@novelty/lib/http-status-codes";
import { generateVerificationToken } from "@novelty/lib/generate-verification-token";
import {
  acquireLock,
  deleteByKey,
  getByKey,
  releaseLock,
  setWithExpiry,
} from "@novelty/redis/queries/index.query";
import { EnqueuingError } from "@novelty/message-queue/lib/error";
import {
  DUMMY_PASSWORD_HASH,
  EMAIL_QUEUE_COMPLETED_JOBS_LIMIT,
  EMAIL_QUEUE_COMPLETED_JOBS_TIME,
  EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
  EMAIL_QUEUE_REMOVED_JOBS_TIME,
  FORGOT_PASSWORD_EMAIL_EXPIRY_TIME,
  LOCK_TTL,
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "./lib/config";
import { addJobToQueue } from "@novelty/message-queue/lib/add-job-to-queue";
import type {
  ForgotPasswordBodySchema,
  VerifyEmailBodySchema,
} from "@novelty/lib/validations/auth";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
  invalidateSession,
} from "./session.service";
import { getUserInfoQuery } from "@novelty/db/queries/user.query";

export const registerUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  body: InsertUser["register"],
): Promise<ServiceResponse<TStatusCodes> & { body?: SelectUser }> => {
  const deps = prepareDependencies(dependencies, "redisClient");

  const existingUser = await getUserByEmailQuery(deps, body.email);

  if (existingUser) {
    return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
  }

  const hashedPassword = await hashString(body.password as string);

  let newUser;
  try {
    [newUser] = await createUserQuery(deps, {
      email: body.email,
      password: hashedPassword,
    });
  }
  catch (err: any) {
    if (
      err?.message
      && err.message.includes("duplicate key value violates unique constraint")
    ) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }
    throw new QueryExecutionError("Failed to create user", err);
  }

  if (!newUser || typeof newUser !== "object") {
    throw new QueryExecutionError(
      "Failed to create user",
      new Error("Unknown error"),
    );
  }

  return {
    status: HttpStatusCodes.CREATED as TStatusCodes,
    body: newUser,
  };
};

export const sendVerificationEmail = async <
  TStatusCodes extends HttpStatusCodeValue,
>(
  dependencies: Required<Omit<ServiceDependencies, "s3Client" | "bucketName">>,
  body: InsertUser["sendEmail"],
): Promise<ServiceResponse<TStatusCodes> & { body?: string }> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");
  const redisDependencies = prepareDependencies(dependencies, "dbInstance");

  const lockKey = `lock:send-email-verification:${body.email}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(redisDependencies, lockKey, ttl);

  if (!lock) {
    return {
      status: HttpStatusCodes.CONFLICT as TStatusCodes,
      error: {
        name: "Locker failure",
        message: "Another process is already handling this email",
      },
    };
  }
  try {
    const user = await getUserByEmailQuery(dbDependencies, body.email);

    if (!user) {
      return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
    }

    if (user.isEmailVerified === true) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    const encryptedId = encryptString(user.id);

    const token = generateVerificationToken(VERIFICATION_EMAIL_TOKEN_LENGTH);

    const redisKey = `verify-email:${encryptedId}`;

    await setWithExpiry(
      redisDependencies,
      redisKey,
      token,
      VERIFICATION_EMAIL_EXPIRY_TIME,
    );

    try {
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
    catch (err: unknown) {
      await deleteByKey(redisDependencies, redisKey);
      throw new EnqueuingError("send-verification-email", err as Error);
    }

    return {
      status: HttpStatusCodes.OK as TStatusCodes,
      body: encryptedId,
    };
  }
  finally {
    if (lock) {
      await releaseLock(redisDependencies, lock);
    }
  }
};

export const verifyEmail = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: VerifyEmailBodySchema,
): Promise<
  ServiceResponse<TStatusCodes> & {
    data?: {
      sessionToken: string;
      expiresAt: Date;
    };
  }
> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");
  const redisDependencies = prepareDependencies(dependencies, "dbInstance");

  const { encryptedUserId, verificationCode } = body;

  const redisVerificationCode = await getByKey(
    redisDependencies,
    `verify-email:${encryptedUserId}`,
  );

  if (!redisVerificationCode) {
    constantTimeCompare("", "");
    return { status: HttpStatusCodes.BAD_REQUEST as TStatusCodes };
  }

  if (!constantTimeCompare(redisVerificationCode ?? "", verificationCode)) {
    return { status: HttpStatusCodes.BAD_REQUEST as TStatusCodes };
  }

  const userId = decryptString(encryptedUserId);

  const queryResult = await getIsEmailVerifiedQuery(
    dbDependencies,
    "id",
    userId,
  );

  if (queryResult === undefined) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  if (queryResult?.isEmailVerified) {
    await deleteByKey(redisDependencies, `verify-email:${encryptedUserId}`);
    return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
  }

  const [updatedUser] = await updateUserByIdQuery(
    dbDependencies,
    { isEmailVerified: true },
    userId,
  );

  if (updatedUser?.isEmailVerified === false || !updatedUser) {
    throw new QueryExecutionError("Failed to update user");
  }

  await deleteByKey(redisDependencies, `verify-email:${encryptedUserId}`);

  const sessionToken = generateSessionToken();

  const { expiresAt } = await createSession(
    redisDependencies,
    sessionToken,
    userId,
  );

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    data: {
      sessionToken,
      expiresAt,
    },
  };
};

interface AuthenticatedSessionResponseData {
  user: {
    id: string;
    isEmailVerified: boolean;
    isOnboarded: boolean;
    userInfo: Record<string, unknown>;
  };
  token: string;
  expiresAt: Date;
}

export const createAuthenticatedSessionResponse = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "messageQueueInstance">,
  userId: string,
): Promise<{
  token: string;
  expiresAt: Date;
  user: AuthenticatedSessionResponseData["user"];
}> => {
  // TODO: Implement blacklist check

  const sessionToken = generateSessionToken();
  const { expiresAt } = await createSession(dependencies, sessionToken, userId);

  const fullUserInfo = await getUserInfoQuery(dependencies, userId);
  if (!fullUserInfo || !fullUserInfo.userInfo) {
    dependencies.logger.error({
      message: "User info not found after successful authentication step",
      source: "_createAuthenticatedSessionResponse",
      userId,
      reqId: dependencies.reqId,
    });

    throw new QueryExecutionError("User info missing for authenticated user.");
  }

  return {
    token: sessionToken,
    expiresAt,
    user: fullUserInfo as AuthenticatedSessionResponseData["user"],
  };
};

export const loginUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<ServiceDependencies, "messageQueueInstance">,
  body: InsertUser["login"],
): Promise<
  ServiceResponse<TStatusCodes> & { data?: AuthenticatedSessionResponseData }
> => {
  const { email, password } = body;
  const user = await getUserByEmailQuery(dependencies, email, true);

  let passwordMatch = false;

  if (user) {
    passwordMatch = await verifyHash(password, user.password);
  }
  else {
    try {
      await verifyHash(password, DUMMY_PASSWORD_HASH);
    }
    catch (dummyError: unknown) {
      dependencies.logger.warn({
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

    return { status: HttpStatusCodes.UNAUTHORIZED as TStatusCodes };
  }

  if (!user) {
    dependencies.logger.error({
      message: "Password matched but user not found",
      source: "loginUser",
      email,
      reqId: dependencies.reqId,
    });
    throw new Error("User data inconsistency during login.");
  }

  const sessionData = await createAuthenticatedSessionResponse(
    dependencies,
    user.id,
  );

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    data: sessionData,
  };
};

export const logoutUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance", "dbInstance"]
  >,
  userId: string,
  sessionId: string,
): Promise<ServiceResponse<TStatusCodes>> => {
  await invalidateSession(dependencies, sessionId, userId);

  return { status: HttpStatusCodes.NO_CONTENT as TStatusCodes };
};

export const sendForgotPasswordEmail = async <
  TStatusCodes extends HttpStatusCodeValue,
>(
  dependencies: Required<Omit<ServiceDependencies, "s3Client" | "bucketName">>,
  body: InsertUser["sendEmail"],
): Promise<ServiceResponse<TStatusCodes>> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");
  const { email } = body;

  const lockKey = `lock:send-forgot-password-email:${email}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(dbDependencies, lockKey, ttl);

  if (!lock) {
    return {
      status: HttpStatusCodes.CONFLICT as TStatusCodes,
      error: {
        name: "Locker failure",
        message: "Password reset request already in progress for this email",
      },
    };
  }

  try {
    const user = await getUserByEmailQuery(dependencies, email);
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
      status: HttpStatusCodes.NO_CONTENT as TStatusCodes,
    };
  }
  finally {
    await releaseLock(dependencies, lock);
  }
};

export const forgotPassword = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["messageQueueInstance"]
  >,
  body: ForgotPasswordBodySchema,
): Promise<
  ServiceResponse<TStatusCodes> & { data?: AuthenticatedSessionResponseData }
> => {
  const { newPassword, token: rawToken } = body;

  const hashedToken = encodeToken(rawToken);
  const redisKey = `forgot-password:${hashedToken}`;

  const lockKey = `forgot-password-lock:${hashedToken}`;
  const ttl = LOCK_TTL;

  const lock = await acquireLock(dependencies, lockKey, ttl);

  if (!lock) {
    return {
      status: HttpStatusCodes.CONFLICT as TStatusCodes,
      error: {
        name: "Locker failure",
        message: "Password forgot request already in progress for this email",
      },
    };
  }
  const userId = await getByKey(dependencies, redisKey);

  if (!userId) {
    return {
      status: HttpStatusCodes.BAD_REQUEST as TStatusCodes,
    };
  }

  const user = await getUserByIdQuery(dependencies, userId);

  if (!user) {
    await deleteByKey(dependencies, redisKey);
    return {
      status: HttpStatusCodes.BAD_REQUEST as TStatusCodes,
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
      status: HttpStatusCodes.OK as TStatusCodes,
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
    return { status: HttpStatusCodes.OK as TStatusCodes };
  }
};

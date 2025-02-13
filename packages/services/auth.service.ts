import type { ServiceDependencies, ServiceResponse } from "./types";
import type { InsertUser, SelectUser } from "@novelty/db/schemas/user.schema";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
  updateUserByIdQuery,
} from "@novelty/db/queries/auth.query";
import {
  decryptString,
  encryptString,
  hashPassword,
} from "@novelty/lib/auth/cryptography";
import {
  DatabaseConnectionError,
  QueryExecutionError,
} from "@novelty/db/lib/errors";
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
  EMAIL_QUEUE_COMPLETED_JOBS_LIMIT,
  EMAIL_QUEUE_COMPLETED_JOBS_TIME,
  EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "./lib/config";
import { addJobToQueue } from "@novelty/message-queue/lib/add-job-to-queue";
import type { VerifyEmailBodySchema } from "@novelty/lib/validations/auth";
import { createSession, generateSessionToken } from "./session.service";

export const registerUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  body: InsertUser["register"],
): Promise<ServiceResponse<TStatusCodes> & { body?: SelectUser }> => {
  const deps = prepareDependencies(dependencies, "redisClient");

  try {
    const existingUser = await getUserByEmailQuery(deps, body.email as string);

    if (
      existingUser !== undefined
      && (typeof existingUser !== "object" || Array.isArray(existingUser))
    ) {
      throw new QueryExecutionError(
        "Invalid data returned from getUserByEmailQuery",
      );
    }

    if (existingUser) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    const hashedPassword = await hashPassword(body.password as string);

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
  }
  catch (error) {
    if (error instanceof DatabaseConnectionError) {
      throw error;
    }

    if (error instanceof QueryExecutionError) {
      throw error;
    }

    throw error;
  }
};

export const sendVerificationEmail = async <
  TStatusCodes extends HttpStatusCodeValue,
>(
  dependencies: Required<ServiceDependencies>,
  body: InsertUser["sendVerificationEmail"],
): Promise<ServiceResponse<TStatusCodes> & { body?: string }> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");
  const redisDependencies = prepareDependencies(dependencies, "dbInstance");

  const lockKey = `lock:send-email-verification:${body.email}`;
  const lockValue = `unique-lock-value-${Date.now()}`;
  const ttl = 30;

  const isLockAcquired = await acquireLock(
    redisDependencies,
    lockKey,
    lockValue,
    ttl,
  );

  if (!isLockAcquired) {
    return {
      status: HttpStatusCodes.CONFLICT as TStatusCodes,
      error: {
        name: "Locker failure",
        message: "Another process is already handling this email",
      },
    };
  }

  try {
    const user = await getUserByEmailQuery(
      dbDependencies,
      body.email as string,
    );

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
            age: EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
            count: EMAIL_QUEUE_REMOVED_JOBS_LIMIT,
          },
        },
      );
    }
    catch (err: unknown) {
      deleteByKey(redisDependencies, redisKey);
      throw new EnqueuingError("send-verification-email", err as Error);
    }

    return {
      status: HttpStatusCodes.OK as TStatusCodes,
      body: encryptedId,
    };
  }
  finally {
    await releaseLock(redisDependencies, lockKey, lockValue);
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

  if (redisVerificationCode !== verificationCode) {
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

import type { ServiceDependencies, ServiceResponse } from "./types";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
} from "@novelty/db/queries/auth.query";
import { hashPassword } from "./lib/auth";
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

export const registerUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  body: InsertUser["register"],
): Promise<ServiceResponse<TStatusCodes>> => {
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
): Promise<ServiceResponse<TStatusCodes>> => {
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
      body: {
        message: "Another process is already handling this email",
      },
    };
  }

  try {
    const isEmailVerified = await getIsEmailVerifiedQuery(
      dbDependencies,
      body.email as string,
    );

    if (isEmailVerified?.isEmailVerified === undefined) {
      return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
    }

    if (isEmailVerified.isEmailVerified === true) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    const token = generateVerificationToken(VERIFICATION_EMAIL_TOKEN_LENGTH);

    const redisKey = `verify-email:${body.email}`;

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
    };
  }
  finally {
    await releaseLock(redisDependencies, lockKey, lockValue);
  }
};

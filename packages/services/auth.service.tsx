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
import {
  HttpStatusCodes,
  type HttpStatusCodeValue,
} from "@novelty/lib/http-status-codes";
import { generateVerificationToken } from "@novelty/lib/generate-verification-token";
import { setWithExpiry } from "@novelty/redis/queries/index.query";
import { emailClient } from "@novelty/email/client";
import { EmailDeliveryError } from "@novelty/email/error";
import VerifyEmail from "@novelty/email/templates/prototype.email";
import {
  VERIFICATION_EMAIL_EXPIRY_TIME,
  VERIFICATION_EMAIL_TOKEN_LENGTH,
} from "./lib/config";
import * as React from "react";

export const registerUser = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: InsertUser["register"],
): Promise<ServiceResponse<TStatusCodes>> => {
  const deps = prepareDependencies(dependencies, "redisClient");

  try {
    const existingUser = await getUserByEmailQuery(deps, body.email);

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

    const hashedPassword = await hashPassword(body.password);

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
  dependencies: ServiceDependencies,
  body: InsertUser["sendVerificationEmail"],
  senderEmail: string,
): Promise<ServiceResponse<TStatusCodes>> => {
  const dbDependencies = prepareDependencies(dependencies, "redisClient");
  const redisDependencies = prepareDependencies(dependencies, "dbInstance");

  const isEmailVerified = await getIsEmailVerifiedQuery(
    dbDependencies,
    body.email,
  );

  if (isEmailVerified?.isEmailVerified === undefined) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  if (isEmailVerified.isEmailVerified === true) {
    return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
  }

  const token = generateVerificationToken(VERIFICATION_EMAIL_TOKEN_LENGTH);

  const { error } = await emailClient.emails.send({
    from: senderEmail,
    to: body.email,
    subject: "Email verification link",
    react: <VerifyEmail validationCode={token} />,
  });

  if (error) {
    throw new EmailDeliveryError(`${error.message}`);
  }

  await setWithExpiry(
    redisDependencies,
    `verify-email:${body.email}`,
    token,
    VERIFICATION_EMAIL_EXPIRY_TIME,
  );

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
  };
};

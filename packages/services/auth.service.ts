import type { ServiceDependencies, ServiceResponse } from "./types";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import {
  createUserQuery,
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

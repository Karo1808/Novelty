import type { ServiceDependencies, ServiceResponse } from "types";
import type { InsertUser } from "@novelty/db/schemas/user.schema";
import { createUser, getUserByEmail } from "@novelty/db/queries/auth.query";
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
    const doesEmailAlreadyExist = !!(await getUserByEmail(deps, body.email));

    if (doesEmailAlreadyExist) {
      return { status: HttpStatusCodes.CONFLICT as TStatusCodes };
    }

    const hashedPassword = await hashPassword(body.password);

    const newUser = await createUser(deps, {
      email: body.email,
      password: hashedPassword,
    });

    return {
      status: HttpStatusCodes.CREATED as TStatusCodes,
      body: newUser,
    };
  }
  catch (error) {
    if (error instanceof DatabaseConnectionError) {
      return {
        status: HttpStatusCodes.SERVICE_UNAVAILABLE as TStatusCodes,
        source: "db",
        error,
      };
    }

    if (error instanceof QueryExecutionError) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR as TStatusCodes,
        error,
      };
    }

    throw error;
  }
};

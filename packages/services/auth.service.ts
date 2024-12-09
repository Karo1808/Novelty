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

export const registerUser = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
  body: InsertUser["register"],
): Promise<ServiceResponse> => {
  const deps = prepareDependencies(dependencies, "redisClient");

  try {
    const doesEmailAlreadyExist = !!(await getUserByEmail(deps, body.email));

    if (doesEmailAlreadyExist) {
      return { status: 409 };
    }

    const hashedPassword = await hashPassword(body.password);

    const newUser = await createUser(deps, {
      email: body.email,
      password: hashedPassword,
    });

    return {
      status: 201,
      body: newUser,
    };
  }
  catch (error) {
    if (error instanceof DatabaseConnectionError) {
      return { status: 503, source: "db", error };
    }

    if (error instanceof QueryExecutionError) {
      return { status: 500, error };
    }
    throw error;
  }
};

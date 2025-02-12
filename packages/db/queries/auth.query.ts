import type {
  InsertUser,
  SelectUser,
  UpdateUser,
} from "../schemas/user.schema";
import { usersTable } from "../schemas/user.schema";
import { createDBQuery } from "../lib/create-db-query";
import type { Dependencies } from "../lib/types";
import { eq } from "drizzle-orm";

export const getUserByEmailQuery = (
  dependencies: Dependencies,
  email: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserByEmail",
    query: async (db) => {
      return await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        columns: {
          password: false,
        },
      });
    },
  });
};

export const createUserQuery = (
  dependencies: Dependencies,
  newUser: InsertUser["register"],
) => {
  return createDBQuery({
    dependencies,
    queryName: "createUser",
    query: async (db) => {
      return await db.insert(usersTable).values(newUser).returning({
        id: usersTable.id,
        email: usersTable.email,
        isEmailVerified: usersTable.isEmailVerified,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      });
    },
  });
};

export const getIsEmailVerifiedQuery = (
  dependencies: Dependencies,
  fieldName: keyof SelectUser,
  value: any,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getIsEmailVerifiedQuery",
    query: async (db) => {
      return await db.query.usersTable.findFirst({
        where: eq(usersTable[fieldName], value),
        columns: {
          isEmailVerified: true,
        },
      });
    },
  });
};

export const getUserByIdQuery = (
  dependencies: Dependencies,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserByIdQuery",
    query: async (db) => {
      return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
          password: false,
        },
      });
    },
  });
};

export const updateUserByIdQuery = (
  dependencies: Dependencies,
  body: UpdateUser,
  userId: SelectUser["id"],
) => {
  return createDBQuery({
    dependencies,
    queryName: "updateUserByIdQuery",
    query: async (db) => {
      return await db
        .update(usersTable)
        .set(body)
        .where(eq(usersTable.id, userId))
        .returning();
    },
  });
};

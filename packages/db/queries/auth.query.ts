import type { InsertUser } from "../schemas/user.schema";
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
    query: (db) => {
      return db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
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
    query: (db) => {
      return db.insert(usersTable).values(newUser).returning({
        id: usersTable.id,
        email: usersTable.email,
        isEmailVerified: usersTable.isEmailVerified,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      });
    },
  });
};

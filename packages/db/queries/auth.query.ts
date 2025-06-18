import type { Dependencies } from "../lib/types";
import type {
  InsertAuthProvider,
  SelectAuthProvider,
} from "../schemas/auth-provider.schema";
import type {
  InsertUser,
  SelectUser,
  UpdateUser,
} from "../schemas/user.schema";
import { and, eq } from "drizzle-orm";
import { createDBQuery } from "../lib/create-db-query";
import { authProvidersTable } from "../schemas/auth-provider.schema";
import { usersTable } from "../schemas/user.schema";

type SelectUserWithPassword = SelectUser & { password: string };

export function getUserByEmailQuery(
  dependencies: Dependencies,
  email: string,
  withPassword: true,
): Promise<SelectUserWithPassword | undefined>;

export function getUserByEmailQuery(
  dependencies: Dependencies,
  email: string,
  withPassword?: false | undefined,
): Promise<SelectUser | undefined>;

export function getUserByEmailQuery(
  dependencies: Dependencies,
  email: string,
  withPassword: boolean = false,
): Promise<SelectUser | SelectUserWithPassword | undefined> {
  return createDBQuery({
    dependencies,
    queryName: "getUserByEmail",
    query: async (db) => {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (!user) {
        return undefined;
      }

      if (!withPassword) {
        const { password, ...userWithoutPassword }
          = user as SelectUserWithPassword;
        return userWithoutPassword as SelectUser;
      }

      return user as SelectUserWithPassword;
    },
  });
}

export const createUserQuery = (
  dependencies: Dependencies,
  newUser: InsertUser["register"],
  provider: InsertAuthProvider["init"]["provider"],
  providerUserId?: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "createUser",
    query: async (db) => {
      const [createdUser] = await db
        .insert(usersTable)
        .values(newUser)
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          isEmailVerified: usersTable.isEmailVerified,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
          isOnboarded: usersTable.isOnboarded,
        });

      if (!createdUser || !createdUser.id) {
        return null;
      }

      await db.insert(authProvidersTable).values({
        provider,
        userId: createdUser.id,
        providerUserId,
      });

      return createdUser;
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

export const getProvidersByProviderUserId = (
  dependencies: Dependencies,
  provider: SelectAuthProvider["provider"],
  providerUserId: SelectAuthProvider["providerUserId"],
) => {
  return createDBQuery({
    dependencies,
    queryName: "getProvidersByProviderUserId",
    query: async (db) => {
      return await db.query.authProvidersTable.findFirst({
        where: and(
          (eq(authProvidersTable.provider, provider),
          eq(authProvidersTable.providerUserId, providerUserId!)),
        ),
      });
    },
  });
};

export const createProvider = (
  dependencies: Dependencies,
  newProvider: InsertAuthProvider["authenticate"],
) => {
  return createDBQuery({
    dependencies,
    queryName: "createProvider",
    query: async (db) => {
      return await db.insert(authProvidersTable).values(newProvider);
    },
  });
};

import { eq } from "drizzle-orm";
import { createDBQuery } from "../lib/create-db-query";
import type { Dependencies } from "../lib/types";
import type { UpdateUserInfo } from "../schemas/user-info.schema";
import { userInfoTable } from "../schemas/user-info.schema";
import { usersTable } from "../schemas/user.schema";

export const getProfileByUserIdQuery = (
  dependencies: Dependencies,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserProfileByUserIdQuery",
    query: async (db) => {
      return await db.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, userId),
        columns: {
          avatarUrl: true,
          bio: true,
          username: true,
        },
      });
    },
  });
};

export const getIsUsernameUniqueQuery = (
  dependencies: Dependencies,
  username: string,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getIsUsernameUniqueQuery",
    query: async (db) => {
      const user = await db.query.userInfoTable.findFirst({
        where: eq(userInfoTable.username, username),
      });

      if (user?.userId === userId) {
        return true;
      }

      return user === undefined;
    },
  });
};

export const updateUserProfileByUserIdQuery = (
  dependencies: Dependencies,
  body: UpdateUserInfo["profile"],
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "updateUserProfileByUserIdQuery",
    query: async (db) => {
      return await db
        .update(userInfoTable)
        .set(body)
        .where(eq(userInfoTable.userId, userId));
    },
  });
};

export const getPreferencesByUserIdQuery = (
  dependencies: Dependencies,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserPreferencesByUserIdQuery",
    query: async (db) => {
      return await db.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, userId),
        columns: {
          preferences: true,
        },
      });
    },
  });
};

export const updateUserPreferencesByIdQuery = (
  dependencies: Dependencies,
  body: UpdateUserInfo["preferences"],
  userId: string,
) => {
  const stringifiedBody = JSON.stringify(body);

  return createDBQuery({
    dependencies,
    queryName: "updateUserPreferencesByIdQuery",
    query: async (db) => {
      return await db
        .update(userInfoTable)
        .set({ preferences: stringifiedBody })
        .where(eq(userInfoTable.userId, userId));
    },
  });
};

export const getUserInfoQuery = (
  dependencies: Dependencies,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserInfoQuery",
    query: async (db) => {
      return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
          id: true,
          isOnboarded: true,
          isEmailVerified: true,
        },
        with: {
          userInfo: {
            columns: {
              username: true,
              avatarUrl: true,
              bio: true,
              preferences: true,
            },
          },
        },
      });
    },
  });
};

import { eq } from "drizzle-orm";
import { createDBQuery } from "../lib/create-db-query";
import type { Dependencies } from "../lib/types";
import type { UpdateUserInfo } from "../schemas/user-profile.schema";
import { userInfoTable } from "../schemas/user-profile.schema";

export const getProfileByUserIdQuery = (
  dependencies: Dependencies,
  userId: string,
) => {
  return createDBQuery({
    dependencies,
    queryName: "getUserProfileByUserIdQuery",
    query: async (db) => {
      return await db.query.userProfilesTable.findFirst({
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
) => {
  return createDBQuery({
    dependencies,
    queryName: "getIsUsernameUniqueQuery",
    query: async (db) => {
      return (
        (await db.query.userProfilesTable.findFirst({
          where: eq(userInfoTable.username, username),
        })) === undefined
      );
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

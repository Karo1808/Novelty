import { sql } from "drizzle-orm";
import {
  getIsUsernameUniqueQuery,
  getProfileByUserIdQuery,
  updateUserProfileByUserIdQuery,
} from "queries/user.query";
import { userInfoTable } from "schemas/user-profile.schema";
import type { InsertUserInfo } from "schemas/user-profile.schema";
import { usersTable } from "schemas/user.schema";
import { testDb, testDependencies } from "test-setup";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("user queries", () => {
  describe("getProfileByUserIdQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
      id: "123",
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: [],
        authors: [],
        series: [],
      },
      profile: {
        avatarUrl: "url",
        bio: "bio",
        username: "username",
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);

      const res = await testDb.query.usersTable.findFirst();
      const userId = res?.id ?? "";

      await testDb.insert(userInfoTable).values({
        userId,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
    });

    it("should return user profile", async () => {
      const result = await getProfileByUserIdQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.id,
      );

      expect(result).toEqual(dummyUserInfo.profile);
    });

    it("should return undefined if user profile does not exist", async () => {
      await testDb.delete(userInfoTable);

      const result = await getProfileByUserIdQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.id,
      );

      expect(result).toEqual(undefined);
    });
  });

  describe("getIsUsernameUniqueQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
      id: "123",
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: [],
        authors: [],
        series: [],
      },
      profile: {
        avatarUrl: "url",
        bio: "bio",
        username: "username",
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);

      const res = await testDb.query.usersTable.findFirst();
      const userId = res?.id ?? "";

      await testDb.insert(userInfoTable).values({
        userId,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
    });

    it("should return false if not unique", async () => {
      const result = await getIsUsernameUniqueQuery(
        { ...testDependencies, dbInstance: testDb },
        dummyUserInfo.profile.username!,
      );

      expect(result).toBe(false);
    });

    it("should return true if unique", async () => {
      const result = await getIsUsernameUniqueQuery(
        { ...testDependencies, dbInstance: testDb },
        "unique-username",
      );

      expect(result).toBe(true);
    });
  });

  describe("updateUserProfileByUserIdQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
      id: "123",
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: [],
        authors: [],
        series: [],
      },
      profile: {
        avatarUrl: "url",
        bio: "bio",
        username: "username",
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);

      const res = await testDb.query.usersTable.findFirst();
      const userId = res?.id ?? "";

      await testDb.insert(userInfoTable).values({
        userId,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
    });

    it("update user info", async () => {
      await updateUserProfileByUserIdQuery(
        testDependencies,
        {
          avatarUrl: "new-url",
        },
        dummyUser.id,
      );

      const updatedUser = await testDb.query.userProfilesTable.findFirst();

      expect(updatedUser?.avatarUrl).toBe("new-url");
    });
  });
});

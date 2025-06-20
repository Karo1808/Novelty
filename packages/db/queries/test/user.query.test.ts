import type { InsertUserInfo, UpdateUserInfo } from "schemas/user-info.schema";
import { sql } from "drizzle-orm";
import {
  getIsUsernameUniqueQuery,
  getPreferencesByUserIdQuery,
  getProfileByUserIdQuery,
  getUserInfoQuery,
  updateUserPreferencesByIdQuery,
  updateUserProfileByUserIdQuery,
} from "queries/user.query";
import { userInfoTable } from "schemas/user-info.schema";
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

    it("should return false if not unique and not same user", async () => {
      const result = await getIsUsernameUniqueQuery(
        { ...testDependencies, dbInstance: testDb },
        dummyUserInfo.profile.username!,
        "1234",
      );

      expect(result).toBe(false);
    });

    it("should return true if unique and not same user", async () => {
      const result = await getIsUsernameUniqueQuery(
        { ...testDependencies, dbInstance: testDb },
        "unique-username",
        "1234",
      );

      expect(result).toBe(true);
    });

    it("should return true if same user", async () => {
      const result = await getIsUsernameUniqueQuery(
        { ...testDependencies, dbInstance: testDb },
        "unique-username",
        dummyUser.id,
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

      const updatedUser = await testDb.query.userInfoTable.findFirst();

      expect(updatedUser?.avatarUrl).toBe("new-url");
    });
  });

  describe("getPreferencesByUserIdQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
      id: "123",
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: ["genre1", "genre2"],
        authors: ["author1", "author2"],
        series: ["series1", "series2"],
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

    it("should return user preferences", async () => {
      const result = await getPreferencesByUserIdQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.id,
      );

      expect(result?.preferences).toEqual(dummyUserInfo.preferences);
    });

    it("should return undefined if user profile does not exist", async () => {
      await testDb.delete(userInfoTable);

      const result = await getPreferencesByUserIdQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.id,
      );

      expect(result).toEqual(undefined);
    });
  });

  describe("updateUserPreferencesByUserIdQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
      id: "123",
    };

    const dummyUserInfo: InsertUserInfo = {
      preferences: {
        genres: ["genre1", "genre2"],
        authors: ["author1", "author2"],
        series: ["series1", "series2"],
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
      await updateUserPreferencesByIdQuery(
        testDependencies,
        {
          genres: ["fantasy", "sc-fi", "comedy"],
        },
        dummyUser.id,
      );

      const updatedUser = await testDb.query.userInfoTable.findFirst();

      const preferences = updatedUser!
        .preferences as UpdateUserInfo["preferences"];

      expect(preferences.genres.length).toBeGreaterThan(2);
    });
  });
});

describe("getUserInfoQuery", () => {
  const dummyUser = {
    email: "mail@email.com",
    password: "password123",
    id: "123",
  };

  const dummyUserInfo: InsertUserInfo = {
    preferences: {
      genres: ["genre1", "genre2"],
      authors: ["author1", "author2"],
      series: ["series1", "series2"],
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

  it("should return user info", async () => {
    const result = await getUserInfoQuery(
      {
        ...testDependencies,
        dbInstance: testDb,
      },
      "id",
      dummyUser.id,
    );

    expect(result).toMatchObject({
      isOnboarded: false,
      isEmailVerified: false,
      userInfo: {
        preferences: dummyUserInfo.preferences,
        bio: dummyUserInfo.profile.bio,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        username: dummyUserInfo.profile.username,
      },
    });
  });

  it("should return undefined if user profile does not exist", async () => {
    await testDb.delete(usersTable);

    const result = await getUserInfoQuery(
      {
        ...testDependencies,
        dbInstance: testDb,
      },
      "id",
      dummyUser.id,
    );

    expect(result).toEqual(undefined);
  });
});

describe("getPreferencesByUserIdQuery", () => {
  const dummyUser = {
    email: "mail@email.com",
    password: "password123",
    id: "123",
  };

  const dummyUserInfo: InsertUserInfo = {
    preferences: {
      genres: ["genre1", "genre2"],
      authors: ["author1", "author2"],
      series: ["series1", "series2"],
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

  it("should return user info", async () => {
    const result = await getUserInfoQuery(
      {
        ...testDependencies,
        dbInstance: testDb,
      },
      "id",
      dummyUser.id,
    );

    expect(result).toMatchObject({
      isEmailVerified: false,
      isOnboarded: false,
      userInfo: {
        username: dummyUserInfo.profile.username,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        preferences: dummyUserInfo.preferences,
      },
    });
  });

  it("should return undefined if user profile does not exist", async () => {
    await testDb.delete(usersTable);

    const result = await getUserInfoQuery(
      {
        ...testDependencies,
        dbInstance: testDb,
      },
      "id",
      dummyUser.id,
    );

    expect(result).toEqual(undefined);
  });
});

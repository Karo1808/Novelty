import { userInfoTable } from "@novelty/db/schemas/user-profile.schema";
import type { InsertUserInfo } from "@novelty/db/schemas/user-profile.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import { sql } from "drizzle-orm";
import { testDb, testDependencies } from "../test-setup";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as userDbQueries from "@novelty/db/queries/user.query";
import { getProfile } from "../user.service";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { DatabaseConnectionError } from "@novelty/db/lib/errors";

describe("user service", () => {
  const dummyUser = {
    email: "mail@email.com",
    password: "password123",
    id: "123",
    isEmailVerified: true,
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

  describe("getProfile", () => {
    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);

      await testDb.insert(userInfoTable).values({
        userId: dummyUser.id,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        username: dummyUserInfo.profile.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
    });

    it("should successfully complete all operations", async () => {
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );

      const result = await getProfile(
        {
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        dummyUser.id,
      );

      expect(getProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.body).toEqual(dummyUserInfo.profile);
    });

    it("should handle no profile found", async () => {
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );

      const result = await getProfile(
        {
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        "no-id",
      );

      expect(getProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle database errors", async () => {
      vi.spyOn(userDbQueries, "getProfileByUserIdQuery").mockRejectedValueOnce(
        new DatabaseConnectionError("DB error"),
      );

      await expect(
        getProfile(
          {
            dbInstance: testDb,
            logger: testDependencies.logger,
            prometheusRegistry: testDependencies.prometheusRegistry,
            reqId: testDependencies.reqId,
          },
          "no-id",
        ),
      ).rejects.toThrowError("DB error");
    });
  });
});

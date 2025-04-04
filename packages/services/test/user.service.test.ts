import { userInfoTable } from "@novelty/db/schemas/user-info.schema";
import type {
  InsertUserInfo,
  UpdateUserInfo,
} from "@novelty/db/schemas/user-info.schema";
import { usersTable } from "@novelty/db/schemas/user.schema";
import { DrizzleError, eq, sql } from "drizzle-orm";
import { testDb, testDependencies, testRedis, testS3 } from "../test-setup";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as userDbQueries from "@novelty/db/queries/user.query";
import * as authDbQueries from "@novelty/db/queries/auth.query";
import * as fileService from "../file.service";
import * as utils from "../lib/utils";
import * as redisJsonQueries from "@novelty/redis/queries/json.query";
import * as redisQueries from "@novelty/redis/queries/index.query";
import {
  completeOnboarding,
  getPreferences,
  getProfile,
  getUserDraft,
  updatePreferences,
  updateProfile,
  updateUserDraft,
} from "../user.service";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { DatabaseConnectionError } from "@novelty/db/lib/errors";
import { Buffer } from "node:buffer";
import type { UpdateProfile } from "lib/utils";
import { Blob } from "fetch-blob";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  PROFILE_PICTURES_PATH_PREFIX,
  USER_INFO_DRAFT_KEY,
} from "../lib/config";

describe("user service", () => {
  const dummyUser = {
    email: "mail@email.com",
    password: "password123",
    id: "123",
    isEmailVerified: true,
  };

  const dummyUserInfo: InsertUserInfo = {
    preferences: {
      genres: ["genre1", "genre2", "genre3"],
      authors: ["author"],
      series: ["series"],
    },
    profile: {
      avatarUrl: "",
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

  describe("updateProfile", async () => {
    const dummyFile = new Blob([Buffer.from("fake image data")], {
      type: "image/jpg",
    });

    const dummyPayload: UpdateProfile = {
      bio: "new-bio",
      profileImage: dummyFile,
      username: "new-username",
    };

    const dummyBody = {
      userId: dummyUser.id,
      payload: dummyPayload,
    };

    let dummyKey: string;

    // eslint-disable-next-line node/no-process-env
    const bucketName = process.env.R2_BUCKET_NAME;

    beforeEach(async () => {
      vi.useFakeTimers();
      vi.clearAllMocks();
      await testDb.insert(usersTable).values(dummyUser);

      dummyKey = `${PROFILE_PICTURES_PATH_PREFIX}${dummyBody.userId}-${Date.now()}.jpg`;
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
      await testS3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: dummyKey,
        }),
      );
      vi.useRealTimers();
    });

    it("should handle new user profile full update", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );
      const deleteFileSpy = vi.spyOn(fileService, "deleteFile");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );

      const res = await updateProfile(testDependencies, dummyBody);

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(getIsUsernameUniqueQuerySpy).toHaveBeenCalledOnce();
      expect(getIsUsernameUniqueQuerySpy).toHaveResolvedWith(true);

      expect(getProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(deleteFileSpy).not.toHaveBeenCalled();

      expect(uploadFileSpy).toHaveBeenCalled();

      const objects = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objects.Contents?.length).toBe(1);
      expect(objects.Contents?.at(0)?.Key).toBe(
        `${PROFILE_PICTURES_PATH_PREFIX}${dummyBody.userId}-${Date.now()}.jpg`,
      );

      expect(updateUserProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb?.bio).toBe(dummyPayload.bio);
      expect(updatedDb?.avatarUrl).toEqual(
        expect.stringMatching(new RegExp(`${dummyBody.userId}`)),
      );
      expect(updatedDb?.username).toBe(dummyPayload.username);

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle existing profile, updated profile picture", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );
      const deleteFileSpy = vi.spyOn(fileService, "deleteFile");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );
      vi.spyOn(utils, "getOldKey").mockReturnValue(dummyKey);

      await testDb.update(userInfoTable).set({ avatarUrl: "dummy-url" });

      const fileBuffer = Buffer.from(
        await dummyPayload.profileImage!.arrayBuffer(),
      );
      await testS3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: dummyKey,
          Body: fileBuffer,
          ContentType: "image/jpg",
        }),
      );

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: {
          profileImage: dummyPayload.profileImage,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(getIsUsernameUniqueQuerySpy).not.toHaveBeenCalled();

      expect(getProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(deleteFileSpy).toHaveBeenCalled();

      expect(uploadFileSpy).toHaveBeenCalled();

      const objectsAfterUpload = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objectsAfterUpload.Contents?.length).toBe(1);
      expect(objectsAfterUpload.Contents?.at(0)?.Key).toBe(dummyKey);

      expect(updateUserProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb?.bio).toBe(dummyUserInfo.profile.bio);
      expect(updatedDb?.avatarUrl).toEqual(
        expect.stringMatching(new RegExp(`${dummyBody.userId}`)),
      );
      expect(updatedDb?.username).toBe(dummyUserInfo.profile.username);

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle partial update (username, bio)", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );
      const deleteFileSpy = vi.spyOn(fileService, "deleteFile");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: {
          bio: dummyPayload.bio,
          username: dummyPayload.username,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(getIsUsernameUniqueQuerySpy).toHaveBeenCalled();
      expect(getIsUsernameUniqueQuerySpy).toHaveResolvedWith(true);

      expect(getProfileByUserIdQuerySpy).not.toHaveBeenCalled();

      expect(deleteFileSpy).not.toHaveBeenCalled();

      expect(uploadFileSpy).not.toHaveBeenCalled();

      const objectsAfterUpload = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objectsAfterUpload.Contents).toBe(undefined);

      expect(updateUserProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb?.bio).toBe(dummyPayload.bio);
      expect(updatedDb?.avatarUrl).toBeFalsy();
      expect(updatedDb?.username).toBe(dummyPayload.username);

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle partial update (bio)", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );
      const getProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getProfileByUserIdQuery",
      );
      const deleteFileSpy = vi.spyOn(fileService, "deleteFile");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: {
          bio: dummyPayload.bio,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(getIsUsernameUniqueQuerySpy).not.toHaveBeenCalled();

      expect(getProfileByUserIdQuerySpy).not.toHaveBeenCalled();

      expect(deleteFileSpy).not.toHaveBeenCalled();

      expect(uploadFileSpy).not.toHaveBeenCalled();

      const objectsAfterUpload = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objectsAfterUpload.Contents).toBe(undefined);

      expect(updateUserProfileByUserIdQuerySpy).toHaveBeenCalledOnce();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb?.bio).toBe(dummyPayload.bio);
      expect(updatedDb?.avatarUrl).toBeFalsy();
      expect(updatedDb?.username).toBe(dummyUserInfo.profile.username);

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle user not found", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );

      await testDb.delete(usersTable);

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: {
          bio: dummyPayload.bio,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(uploadFileSpy).not.toHaveBeenCalled();

      const objectsAfterUpload = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objectsAfterUpload.Contents).toBe(undefined);

      expect(updateUserProfileByUserIdQuerySpy).not.toHaveBeenCalled();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb).toBeUndefined();

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle username already exists", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      const updateUserProfileByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      );

      await testDb.insert(usersTable).values({
        isEmailVerified: true,
        id: "1234",
        email: "dummy@mail.com",
        password: "pass",
      });

      await testDb.insert(userInfoTable).values({
        username: dummyPayload.username,
        userId: "1234",
      });

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: {
          username: dummyPayload.username,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(getIsUsernameUniqueQuerySpy).toHaveBeenCalledOnce();
      expect(getIsUsernameUniqueQuerySpy).toHaveResolvedWith(false);

      expect(uploadFileSpy).not.toHaveBeenCalled();

      const objectsAfterUpload = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objectsAfterUpload.Contents).toBe(undefined);

      expect(updateUserProfileByUserIdQuerySpy).not.toHaveBeenCalled();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb?.username).toBe(dummyUserInfo.profile.username);

      expect(res.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should rollback S3 upload when database update fails", async () => {
      vi.spyOn(utils, "getOldKey").mockReturnValue(dummyKey);
      const deleteFileSpy = vi.spyOn(fileService, "deleteFile");
      const uploadFileSpy = vi.spyOn(fileService, "uploadFile");
      vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      ).mockRejectedValueOnce(new DrizzleError({ message: "DB failure" }));

      await expect(
        updateProfile(testDependencies, {
          userId: dummyUser.id,
          payload: { profileImage: dummyPayload.profileImage },
        }),
      ).rejects.toThrow("Failed to update user profile");

      expect(uploadFileSpy).toHaveBeenCalled();
      expect(deleteFileSpy).toHaveBeenCalled();
    });

    it("should allow keeping the same username without conflict", async () => {
      const currentUsername = dummyUserInfo.profile.username;
      const getIsUsernameUniqueQuerySpy = vi.spyOn(
        userDbQueries,
        "getIsUsernameUniqueQuery",
      );

      const res = await updateProfile(testDependencies, {
        userId: dummyUser.id,
        payload: { username: currentUsername },
      });

      expect(getIsUsernameUniqueQuerySpy).toHaveBeenCalledWith(
        expect.anything(),
        currentUsername,
        dummyUser.id,
      );

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle update failure", async () => {
      vi.spyOn(utils, "getOldKey").mockReturnValue(dummyKey);
      vi.spyOn(
        userDbQueries,
        "updateUserProfileByUserIdQuery",
      ).mockRejectedValueOnce(new DrizzleError({ message: "faliure" }));

      await expect(
        updateProfile(testDependencies, dummyBody),
      ).rejects.toThrowError("Failed to update user profile");
    });

    it("should propagate errors during old image deletion", async () => {
      vi.spyOn(fileService, "deleteFile").mockRejectedValueOnce(
        new Error("S3 Delete Failed"),
      );
      vi.spyOn(utils, "getOldKey").mockReturnValue(dummyKey);

      await testDb.update(userInfoTable).set({ avatarUrl: "dummy-url" });

      const fileBuffer = Buffer.from(
        await dummyPayload.profileImage!.arrayBuffer(),
      );
      await testS3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: dummyKey,
          Body: fileBuffer,
          ContentType: "image/jpg",
        }),
      );

      await expect(
        updateProfile(testDependencies, {
          userId: dummyUser.id,
          payload: { profileImage: dummyPayload.profileImage },
        }),
      ).rejects.toThrow("S3 Delete Failed");

      expect(vi.spyOn(fileService, "uploadFile")).not.toHaveBeenCalled();
    });

    it("should handle unexpected error", async () => {
      vi.spyOn(userDbQueries, "getIsUsernameUniqueQuery").mockRejectedValueOnce(
        new Error("unexpected error"),
      );

      await expect(
        updateProfile(testDependencies, dummyBody),
      ).rejects.toThrowError();
    });
  });

  describe("getPreferences", () => {
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
      const getPreferencesByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getPreferencesByUserIdQuery",
      );

      const result = await getPreferences(
        {
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        dummyUser.id,
      );

      expect(getPreferencesByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.body).toEqual(dummyUserInfo.preferences);
    });

    it("should handle no profile found", async () => {
      const getPreferencesByUserIdQuerySpy = vi.spyOn(
        userDbQueries,
        "getPreferencesByUserIdQuery",
      );

      const result = await getPreferences(
        {
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        "no-id",
      );

      expect(getPreferencesByUserIdQuerySpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle database errors", async () => {
      vi.spyOn(
        userDbQueries,
        "getPreferencesByUserIdQuery",
      ).mockRejectedValueOnce(new DatabaseConnectionError("DB error"));

      await expect(
        getPreferences(
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

  describe("updatePreferences", async () => {
    const dummyPayload: UpdateUserInfo["preferences"] = {
      genres: ["new-genre"],
      authors: ["new-author"],
      series: ["new-series"],
    };

    const dummyBody = {
      userId: dummyUser.id,
      payload: dummyPayload,
    };

    beforeEach(async () => {
      vi.clearAllMocks();
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

    it("should handle new user preferences ", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const updateUserPreferencesByIdQuerySpy = vi.spyOn(
        userDbQueries,
        "updateUserPreferencesByIdQuery",
      );

      const res = await updatePreferences(testDependencies, dummyBody);

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(updateUserPreferencesByIdQuerySpy).toHaveBeenCalledOnce();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      const preferences
        = updatedDb?.preferences as UpdateUserInfo["preferences"];

      expect(preferences.authors).toEqual(dummyPayload.authors);

      expect(preferences.genres).toEqual(dummyPayload.genres);

      expect(preferences.series).toEqual(dummyPayload.series);

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("should handle user not found", async () => {
      const getUserByIdQuerySpy = vi.spyOn(authDbQueries, "getUserByIdQuery");
      const updateUserPreferencesByIdQuery = vi.spyOn(
        userDbQueries,
        "updateUserPreferencesByIdQuery",
      );

      await testDb.delete(usersTable);

      const res = await updatePreferences(testDependencies, {
        userId: dummyUser.id,
        payload: {
          genres: dummyPayload.genres,
        },
      });

      expect(getUserByIdQuerySpy).toHaveBeenCalledOnce();

      expect(updateUserPreferencesByIdQuery).not.toHaveBeenCalled();

      const updatedDb = await testDb.query.userInfoTable.findFirst({
        where: eq(userInfoTable.userId, dummyBody.userId),
      });

      expect(updatedDb).toBeUndefined();

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle update failure", async () => {
      vi.spyOn(
        userDbQueries,
        "updateUserPreferencesByIdQuery",
      ).mockRejectedValueOnce(new DrizzleError({ message: "faliure" }));

      await expect(
        updatePreferences(testDependencies, dummyBody),
      ).rejects.toThrowError();
    });

    it("should handle unexpected error", async () => {
      vi.spyOn(authDbQueries, "getUserByIdQuery").mockRejectedValueOnce(
        new Error("unexpected error"),
      );

      await expect(
        updatePreferences(testDependencies, dummyBody),
      ).rejects.toThrowError();
    });
  });

  describe("completeOnboarding", () => {
    const dummyUser = {
      id: "test-id",
      email: "test@mail.com",
      password: "123456",
      isEmailVerified: true,
      isOnboarded: false,
    };

    const dummyUserInfo = {
      userId: dummyUser.id,
      username: "test-user",
      preferences: {
        genres: ["genre1", "genre2", "genre3"],
        authors: ["author"],
        series: ["series"],
      },
    };

    beforeEach(async () => {
      await testDb.insert(usersTable).values(dummyUser);
      await testDb.insert(userInfoTable).values({
        userId: dummyUserInfo.userId,
        username: dummyUserInfo.username,
        preferences: dummyUserInfo.preferences,
      });
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      await testDb.execute(sql`TRUNCATE table users CASCADE`);
      await testDb.execute(sql`TRUNCATE table user_info CASCADE`);
    });

    it("should complete onboarding", async () => {
      const res = await completeOnboarding(testDependencies, {
        userId: dummyUser.id,
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const updatedUser = await testDb.query.usersTable.findFirst({
        where: eq(usersTable.id, dummyUser.id),
      });
      expect(updatedUser?.isOnboarded).toBe(true);
    });

    it("should return 404 if user not found", async () => {
      await testDb.execute(sql`TRUNCATE table users CASCADE`);

      const res = await completeOnboarding(testDependencies, {
        userId: "non-existing-id",
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should return 409 if user is already onboarded", async () => {
      await testDb.update(usersTable).set({ isOnboarded: true });

      const res = await completeOnboarding(testDependencies, {
        userId: dummyUser.id,
      });

      expect(res.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should return 400 if user email is not verified", async () => {
      await testDb.update(usersTable).set({ isEmailVerified: false });

      const res = await completeOnboarding(testDependencies, {
        userId: dummyUser.id,
      });

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("should return 400 if user has no username set", async () => {
      await testDb.update(userInfoTable).set({ username: null });

      const res = await completeOnboarding(testDependencies, {
        userId: dummyUser.id,
      });

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("should return 400 if user has fewer than 3 genres", async () => {
      await testDb.update(userInfoTable).set({
        preferences: { genres: ["genre1", "genre2"], authors: [], series: [] },
      });

      const res = await completeOnboarding(testDependencies, {
        userId: dummyUser.id,
      });

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("should handle database errors", async () => {
      vi.spyOn(authDbQueries, "updateUserByIdQuery").mockRejectedValueOnce(
        new DrizzleError({ message: "DB error" }),
      );
      await expect(
        completeOnboarding(testDependencies, { userId: dummyUser.id }),
      ).rejects.toThrowError("DB error");
    });
  });

  describe("getUserDraft", () => {
    const dummyKey = `${USER_INFO_DRAFT_KEY}:${dummyUser.id}`;

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
      await testRedis.flushall();
    });

    it("should successfully complete all operations", async () => {
      const getByKeyJsonSpy = vi.spyOn(redisJsonQueries, "getByKeyJson");

      await testRedis.call(
        "JSON.SET",
        dummyKey,
        "$",
        JSON.stringify(dummyUserInfo),
      );

      const result = await getUserDraft(
        {
          redisClient: testDependencies.redisClient,
          dbInstance: testDependencies.dbInstance,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        {
          userId: dummyUser.id,
        },
      );

      expect(getByKeyJsonSpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.body[0]).toEqual(dummyUserInfo);
    });

    it("should handle no user info existing", async () => {
      const getByKeyJsonSpy = vi.spyOn(redisJsonQueries, "getByKeyJson");
      const getUserInfoQuerySpy = vi.spyOn(userDbQueries, "getUserInfoQuery");
      const setByKeyJsonSpy = vi.spyOn(redisJsonQueries, "setByKeyJson");

      const result = await getUserDraft(
        {
          redisClient: testRedis,
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        {
          userId: dummyUser.id,
        },
      );

      expect(getByKeyJsonSpy).toHaveBeenCalledTimes(2);
      expect(getUserInfoQuerySpy).toHaveBeenCalledOnce();
      expect(setByKeyJsonSpy).toHaveBeenCalledOnce();

      expect(result.status).toBe(HttpStatusCodes.OK);
      expect(result.body).toEqual({
        username: dummyUserInfo.profile.username,
        avatarUrl: dummyUserInfo.profile.avatarUrl,
        bio: dummyUserInfo.profile.bio,
        preferences: dummyUserInfo.preferences,
      });
    });

    it("should handle user not found", async () => {
      await testDb.delete(usersTable);
      const result = await getUserDraft(
        {
          redisClient: testRedis,
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        {
          userId: dummyUser.id,
        },
      );

      expect(result.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should handle already cached", async () => {
      vi.spyOn(redisQueries, "doesKeyExists").mockResolvedValue(1);

      const result = await getUserDraft(
        {
          redisClient: testRedis,
          dbInstance: testDb,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        {
          userId: dummyUser.id,
        },
      );

      expect(result.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("should handle database errors", async () => {
      vi.spyOn(redisJsonQueries, "getByKeyJson").mockRejectedValueOnce(
        new DatabaseConnectionError("DB error"),
      );

      await expect(
        getUserDraft(
          {
            redisClient: testRedis,
            dbInstance: testDb,
            logger: testDependencies.logger,
            prometheusRegistry: testDependencies.prometheusRegistry,
            reqId: testDependencies.reqId,
          },
          {
            userId: dummyUser.id,
          },
        ),
      ).rejects.toThrowError("DB error");
    });
  });

  describe("updateUserDraft", () => {
    const dummyKey = `${USER_INFO_DRAFT_KEY}:${dummyUser.id}`;

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
      await testRedis.flushall();
    });

    it("should handle updating", async () => {
      await testRedis.call(
        "JSON.SET",
        dummyKey,
        "$",
        JSON.stringify(dummyUserInfo),
      );

      const newPayload = {
        ...dummyUserInfo,
        profile: {
          ...dummyUserInfo.profile,
          username: "draft-user",
        },
      };

      const result = await updateUserDraft(
        {
          redisClient: testDependencies.redisClient,
          dbInstance: testDependencies.dbInstance,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        {
          userId: dummyUser.id,
          payload: newPayload,
        },
      );

      expect(result.status).toBe(HttpStatusCodes.NO_CONTENT);

      const [json] = await redisJsonQueries.getByKeyJson(
        {
          redisClient: testDependencies.redisClient,
          logger: testDependencies.logger,
          prometheusRegistry: testDependencies.prometheusRegistry,
          reqId: testDependencies.reqId,
        },
        dummyKey,
      );

      expect(json).toEqual(newPayload);
    });

    it("should handle database errors", async () => {
      vi.spyOn(redisJsonQueries, "setByKeyJson").mockRejectedValueOnce(
        new DatabaseConnectionError("DB error"),
      );

      await expect(
        updateUserDraft(
          {
            redisClient: testDependencies.redisClient,
            dbInstance: testDependencies.dbInstance,
            logger: testDependencies.logger,
            prometheusRegistry: testDependencies.prometheusRegistry,
            reqId: testDependencies.reqId,
          },
          {
            userId: dummyUser.id,
            payload: {
              ...dummyUserInfo,
              profile: { ...dummyUserInfo.profile, username: "draft-user" },
            },
          },
        ),
      ).rejects.toThrowError("DB error");
    });
  });
});

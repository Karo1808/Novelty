import { afterEach, describe, expect, it } from "vitest";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
} from "../auth.query";
import "dotenv/config";
import { usersTable } from "../../schemas/user.schema";
import { eq } from "drizzle-orm";
import { testDb, testDependencies } from "test-setup";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("auth queries", () => {
  describe("getUserByEmailQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    it("should find and returns the user by email", async () => {
      const startTime = Date.now();

      await testDb.insert(usersTable).values(dummyUser);

      const result = await getUserByEmailQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.email,
      );

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyUser.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result).not.toHaveProperty("password");

      const endTime = Date.now();
      expect(new Date(result!.createdAt).getTime()).toBeGreaterThanOrEqual(
        startTime,
      );
      expect(new Date(result!.updatedAt).getTime()).toBeLessThanOrEqual(
        endTime,
      );

      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should return undefined when user does not exist", async () => {
      const res = await getUserByEmailQuery(testDependencies, dummyUser.email);

      expect(res).toBeUndefined();
    });
  });

  describe("createUser", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    afterEach(async () => {
      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should create user if they don't exist", async () => {
      const startTime = Date.now();

      const [result] = await createUserQuery(testDependencies, dummyUser);

      const endTime = Date.now();

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        id: expect.stringMatching(/^[\w-]{21}$/),
        email: expect.stringMatching(dummyUser.email),
        isEmailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(new Date(result!.createdAt).getTime()).toBeGreaterThanOrEqual(
        startTime,
      );
      expect(new Date(result!.updatedAt).getTime()).toBeLessThanOrEqual(
        endTime,
      );
    });

    it("should throw error if the user already exists", async () => {
      await testDb.insert(usersTable).values(dummyUser);

      await expect(
        createUserQuery(testDependencies, dummyUser),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          "duplicate key value violates unique constraint",
        ),
        name: "QueryExecutionError",
      });
    });
  });

  describe("getIsEmailVerifiedQuery", () => {
    const dummyUser = {
      email: "mail@email.com",
      password: "password123",
    };

    it("should return the isEmailVerified column value", async () => {
      await testDb.insert(usersTable).values(dummyUser);

      const result = await getIsEmailVerifiedQuery(
        {
          ...testDependencies,
          dbInstance: testDb,
        },
        dummyUser.email,
      );

      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        isEmailVerified: false,
      });
      expect(result).not.toHaveProperty("password");

      await testDb
        .delete(usersTable)
        .where(eq(usersTable.email, dummyUser.email));
    });

    it("should return undefined when user does not exist", async () => {
      const res = await getIsEmailVerifiedQuery(
        testDependencies,
        dummyUser.email,
      );

      expect(res).toBeUndefined();
    });
  });
});

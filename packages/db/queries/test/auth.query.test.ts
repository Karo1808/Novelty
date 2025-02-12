import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createUserQuery,
  getIsEmailVerifiedQuery,
  getUserByEmailQuery,
  getUserByIdQuery,
  updateUserByIdQuery,
} from "../auth.query";
import "dotenv/config";
import type { InsertUser } from "../../schemas/user.schema";
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
        { ...testDependencies, dbInstance: testDb },
        "email",
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
        { ...testDependencies, dbInstance: testDb },
        "email",
        dummyUser.email,
      );
      expect(res).toBeUndefined();
    });
  });

  describe("getUserByIdQuery", () => {
    let userId: string;

    const dummyUser = {
      email: "testuser@email.com",
      password: "securepassword",
    };

    beforeEach(async () => {
      const [insertedUser] = await testDb
        .insert(usersTable)
        .values(dummyUser)
        .returning();
      userId = insertedUser!.id;
    });

    afterEach(async () => {
      await testDb.delete(usersTable).where(eq(usersTable.id, userId));
    });

    it("should find and return the user by ID", async () => {
      const result = await getUserByIdQuery(
        { ...testDependencies, dbInstance: testDb },
        userId,
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
    });

    it("should return undefined when user does not exist", async () => {
      const fakeUserId = "non-existent-id";
      const result = await getUserByIdQuery(testDependencies, fakeUserId);
      expect(result).toBeUndefined();
    });
  });

  describe("updateUserByIdQuery", () => {
    let userId: string;

    const dummyUser: InsertUser["register"] = {
      email: "testuser@email.com",
      password: "securepassword",
    };

    beforeEach(async () => {
      const [insertedUser] = await testDb
        .insert(usersTable)
        .values(dummyUser)
        .returning();
      userId = insertedUser!.id;
    });

    afterEach(async () => {
      await testDb.delete(usersTable).where(eq(usersTable.id, userId));
    });

    it("should update a user's email and isEmailVerified status", async () => {
      const newEmail = "updated@email.com";
      const updateData = {
        email: newEmail,
        isEmailVerified: true,
      };

      const result = await updateUserByIdQuery(
        testDependencies,
        updateData,
        userId,
      );
      expect(result).toBeTruthy();

      const updatedUser = await testDb
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then(rows => rows[0]);

      expect(updatedUser).toBeTruthy();
      expect(updatedUser!.email).toBe(newEmail);
      expect(updatedUser!.isEmailVerified).toBe(true);
    });

    it("should update only one field without affecting others", async () => {
      const updateData = { isEmailVerified: true };

      const result = await updateUserByIdQuery(
        testDependencies,
        updateData,
        userId,
      );
      expect(result).toBeTruthy();

      const updatedUser = await testDb
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then(rows => rows[0]);

      expect(updatedUser).toBeTruthy();
      expect(updatedUser!.isEmailVerified).toBe(true);
      expect(updatedUser!.email).toBe(dummyUser.email);
    });

    it("should not update a non-existent user", async () => {
      const fakeUserId = "non-existent-id";
      const updateData = { isEmailVerified: true };

      const result = await updateUserByIdQuery(
        testDependencies,
        updateData,
        fakeUserId,
      );

      expect(result.length).toBe(0);
    });

    it("should not perform an update if the values remain the same", async () => {
      const updateData = {
        email: dummyUser.email,
        isEmailVerified: false,
      };

      const result = await updateUserByIdQuery(
        testDependencies,
        updateData,
        userId,
      );

      expect(result).toBeTruthy();
    });
  });
});

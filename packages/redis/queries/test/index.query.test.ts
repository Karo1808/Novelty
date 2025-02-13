import type { RedisKey, RedisValue } from "ioredis";
import {
  acquireLock,
  addToSet,
  deleteByKey,
  getByKey,
  getSetMembers,
  pingRedisQuery,
  releaseLock,
  removeFromSet,
  setWithExpiry,
} from "queries/index.query";
import { testClient, testDependencies } from "test-setup";
import { describe, expect, it } from "vitest";

describe("index redis queries", () => {
  describe("pingRedisQuery", () => {
    it("should return 'PONG' on successful ping", async () => {
      const result = await pingRedisQuery(testDependencies);
      expect(result).toBe("PONG");
    });
  });

  describe("setWithExpiry", () => {
    it("should set a key with expiry in Redis successfully", async () => {
      const key: RedisKey = "test-key";
      const value: RedisValue = "test-value";
      const expiryTime = 60; // seconds

      const result = await setWithExpiry(
        testDependencies,
        key,
        value,
        expiryTime,
      );
      expect(result).toBe("OK");

      const storedValue = await testClient.get(key);
      expect(storedValue).toBe(value);

      const ttl = await testClient.ttl(key);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(expiryTime);
    });

    it("should handle expiration correctly", async () => {
      const key: RedisKey = "short-expiry-key";
      const value: RedisValue = "short-value";
      const expiryTime = 1; // 1 second

      const result = await setWithExpiry(
        testDependencies,
        key,
        value,
        expiryTime,
      );
      expect(result).toBe("OK");

      const storedValue = await testClient.get(key);
      expect(storedValue).toBe(value);

      await new Promise(resolve => setTimeout(resolve, 2000));
      const expiredValue = await testClient.get(key);
      expect(expiredValue).toBeNull();
    });
  });

  describe("deleteByKey", () => {
    it("should delete an existing key", async () => {
      const key: RedisKey = "test-delete-key";
      const value: RedisValue = "test-value";
      await testClient.set(key, value);

      const result = await deleteByKey(testDependencies, key);
      expect(result).toBe(1);

      const storedValue = await testClient.get(key);
      expect(storedValue).toBeNull();
    });

    it("should return 0 when deleting a non-existent key", async () => {
      const key: RedisKey = "non-existent-key";
      await testClient.del(key);

      const result = await deleteByKey(testDependencies, key);
      expect(result).toBe(0);

      const storedValue = await testClient.get(key);
      expect(storedValue).toBeNull();
    });

    it("should handle multiple key deletions", async () => {
      const key1: RedisKey = "test-key1";
      const key2: RedisKey = "test-key2";
      await testClient.set(key1, "value1");
      await testClient.set(key2, "value2");

      const result1 = await deleteByKey(testDependencies, key1);
      const result2 = await deleteByKey(testDependencies, key2);
      expect(result1).toBe(1);
      expect(result2).toBe(1);

      expect(await testClient.get(key1)).toBeNull();
      expect(await testClient.get(key2)).toBeNull();
    });
  });

  describe("getByKey", () => {
    it("should return the correct value for an existing key", async () => {
      const key: RedisKey = "test-get-key";
      const value: RedisValue = "test-get-value";
      await testClient.set(key, value);

      const result = await getByKey(testDependencies, key);
      expect(result).toBe(value);
    });

    it("should return null for a non-existent key", async () => {
      const key: RedisKey = "non-existent-get-key";
      await testClient.del(key);

      const result = await getByKey(testDependencies, key);
      expect(result).toBeNull();
    });

    it("should handle keys with empty string values", async () => {
      const key: RedisKey = "empty-string-key";
      const value: RedisValue = "";
      await testClient.set(key, value);

      const result = await getByKey(testDependencies, key);
      expect(result).toBe(value);
    });

    it("should handle keys with binary data", async () => {
      const key: RedisKey = "binary-key";
      // eslint-disable-next-line node/prefer-global/buffer
      const value: RedisValue = Buffer.from("binary-data");
      await testClient.set(key, value);

      const result = await getByKey(testDependencies, key);
      expect(result).toBe("binary-data");
    });

    it("should handle large string values", async () => {
      const key: RedisKey = "large-string-key";
      const value: RedisValue = "a".repeat(10_000);
      await testClient.set(key, value);

      const result = await getByKey(testDependencies, key);
      expect(result).toBe(value);
    });
  });

  describe("getSetMembers", () => {
    it("should return all members of a set", async () => {
      const key: RedisKey = "set-members-key";
      const members = ["member1", "member2", "member3"];

      await testClient.del(key);
      for (const member of members) {
        await testClient.sadd(key, member);
      }

      const result = await getSetMembers(testDependencies, key);
      expect(result.sort()).toEqual(members.sort());
    });
  });

  describe("addToSet", () => {
    it("should add new members to a set", async () => {
      const key: RedisKey = "add-set-key";
      await testClient.del(key);
      const membersToAdd = ["a", "b"];

      const result = await addToSet(testDependencies, key, membersToAdd);
      expect(result).toBeGreaterThanOrEqual(membersToAdd.length);

      const members = await testClient.smembers(key);
      expect(members.sort()).toEqual(membersToAdd.sort());
    });
  });

  describe("removeFromSet", () => {
    it("should remove specified members from a set", async () => {
      const key: RedisKey = "remove-set-key";
      const initialMembers = ["x", "y", "z"];
      await testClient.del(key);
      for (const member of initialMembers) {
        await testClient.sadd(key, member);
      }

      const membersToRemove = ["y"];
      const result = await removeFromSet(
        testDependencies,
        key,
        membersToRemove,
      );
      expect(result).toBe(1);

      const remainingMembers = await testClient.smembers(key);
      expect(remainingMembers.sort()).toEqual(["x", "z"].sort());
    });
  });

  describe("acquireLock", () => {
    const key: RedisKey = "test-lock-key";
    const value: RedisValue = "lock-value";
    const expiryTime = 5;
    it("should acquire the lock when key does not exist", async () => {
      await testClient.del(key);
      const result = await acquireLock(
        testDependencies,
        key,
        value,
        expiryTime,
      );
      expect(result).toBe("OK");
    });

    it("should fail to acquire the lock when key already exists", async () => {
      await testClient.set(key, value);
      const result = await acquireLock(testDependencies, key, value, 60);
      expect(result).toBeNull();
    });
  });

  describe("releaseLock", () => {
    const key: RedisKey = "test-lock-key";
    const value: RedisValue = "lock-value";

    it("should release the lock if the key exists and matches the value", async () => {
      await testClient.set(key, value);
      const result = await releaseLock(testDependencies, key, value);
      expect(result).toBe(1);
    });

    it("should not release the lock if the key does not exist", async () => {
      await testClient.del(key);
      const result = await releaseLock(testDependencies, key, value);
      expect(result).toBe(0);
    });

    it("should not release the lock if the value does not match", async () => {
      await testClient.set(key, "different-value");
      const result = await releaseLock(testDependencies, key, value);
      expect(result).toBe(0);
    });
  });
});

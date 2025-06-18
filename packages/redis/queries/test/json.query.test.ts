import type { RedisKey } from "ioredis";
import { testClient, testDependencies } from "test-setup";

import { describe, expect, it } from "vitest";

import { doesKeyExistsJson, getByKeyJson, setByKeyJson } from "../json.query";

describe("redisClient JSON queries", () => {
  describe("setByKeyJson", () => {
    it("should set a JSON object at the default path `$`", async () => {
      const key: RedisKey = "json-key-default-path";
      const jsonValue = { foo: "bar", nested: { x: 1 } };

      await testClient.del(key);

      const result = await setByKeyJson(
        { ...testDependencies, redisClient: testClient },
        key,
        jsonValue,
      );

      expect(result).toBeDefined();

      const raw = await testClient.call("JSON.GET", key, "$");
      const storedJson = raw ? JSON.parse(raw as string) : null;
      expect(storedJson).toEqual([jsonValue]);
    });

    it("should set JSON with a specified expiry", async () => {
      const key: RedisKey = "json-key-expiry";
      const jsonValue = { hello: "world" };
      const expiryTime = 2; // seconds

      await testClient.del(key);

      await setByKeyJson(
        { ...testDependencies, redisClient: testClient },
        key,
        jsonValue,
        "$",
        expiryTime,
      );

      const storedBeforeExpire = await testClient.call("JSON.GET", key, "$");
      expect(storedBeforeExpire).toBeTruthy();

      await new Promise(resolve =>
        setTimeout(resolve, (expiryTime + 1) * 1000),
      );
      const storedAfterExpire = await testClient.call("JSON.GET", key, "$");
      expect(storedAfterExpire).toBeNull();
    });
  });

  describe("getByKeyJson", () => {
    it("should return null if the key does not exist", async () => {
      const key: RedisKey = "json-non-existent";

      await testClient.del(key);

      const result = await getByKeyJson(
        { ...testDependencies, redisClient: testClient },
        key,
      );
      expect(result).toBeNull();
    });

    it("should retrieve the JSON object at root path `$`", async () => {
      const key: RedisKey = "json-get-root";
      const data = { user: { name: "Alice", age: 30 } };

      await testClient.del(key);
      await testClient.call("JSON.SET", key, "$", JSON.stringify(data));

      const result = await getByKeyJson(
        { ...testDependencies, redisClient: testClient },
        key,
      );
      expect(result).toEqual([data]);
    });

    it("should retrieve data at a nested path", async () => {
      const key: RedisKey = "json-get-nested";
      const data = { a: { b: { c: 123 } } };

      await testClient.del(key);
      await testClient.call("JSON.SET", key, "$", JSON.stringify(data));

      const partialResult = await getByKeyJson(
        { ...testDependencies, redisClient: testClient },
        key,
        "$.a.b",
      );
      expect(partialResult).toEqual([{ c: 123 }]);
    });
  });

  describe("doesKeyExistsJson", () => {
    it("should return 0 if the key does not exist in Redis", async () => {
      const key: RedisKey = "json-exists-key-missing";
      await testClient.del(key);

      const result = await doesKeyExistsJson(
        { ...testDependencies, redisClient: testClient },
        key,
      );
      expect(result).toBe(0);
    });

    it("should return 1 if the key exists in Redis", async () => {
      const key: RedisKey = "json-exists-key-present";
      const data = { test: true };

      await testClient.del(key);

      await testClient.call("JSON.SET", key, "$", JSON.stringify(data));

      const result = await doesKeyExistsJson(
        { ...testDependencies, redisClient: testClient },
        key,
      );
      expect(result).toBe(1);
    });
  });
});

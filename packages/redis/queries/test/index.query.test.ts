import type { RedisKey, RedisValue } from "ioredis";
import { pingRedisQuery, setWithExpiry } from "queries/index.query";
import { testClient, testDependencies } from "test-setup";
import { describe, expect, it } from "vitest";

describe("index redis queries", () => {
  describe("pingRedisQuery", () => {
    it("should return 'PONG' on successful ping", async () => {
      const result = await pingRedisQuery(testDependencies);

      expect(result).toBe("PONG");
    });
  });

  describe("setWithExpiryQuery", () => {
    it("should set a key with expiry in Redis successfully", async () => {
      const key: RedisKey = "test-key";
      const value: RedisValue = "test-value";
      const expiryTime = 60;

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
  });

  it("should handle expiration", async () => {
    const key: RedisKey = "short-expiry-key";
    const value: RedisValue = "short-value";
    const expiryTime = 1;

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

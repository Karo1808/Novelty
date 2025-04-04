import type { RedisKey } from "ioredis";
import type { Dependencies } from "../lib/types";
import { createRedisQuery } from "../lib/create-redis-query";
import { DRAFT_EXPIRATION_TIME } from "../lib/config";

export const getByKeyJson = (
  dependencies: Dependencies,
  key: RedisKey,
  jsonPath: string = "$",
) => {
  return createRedisQuery({
    dependencies,
    queryName: "getByKeyJson",
    query: async (redis) => {
      const result = await redis.call("JSON.GET", key, jsonPath);
      return result ? JSON.parse(result as string) : null;
    },
  });
};

export const setByKeyJson = (
  dependencies: Dependencies,
  key: RedisKey,
  value: { [key: string]: unknown },
  jsonPath: string = "$",
  expirationTime: number = DRAFT_EXPIRATION_TIME,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "setByKeyJson",
    query: async (redis) => {
      return await redis
        .multi()
        .call("JSON.SET", key, jsonPath, JSON.stringify(value))
        .expire(key, expirationTime)
        .exec();
    },
  });
};

export const doesKeyExistsJson = (
  dependencies: Dependencies,
  key: RedisKey,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "doesKeyExistsJson",
    query: async (redis) => {
      return await redis.exists(key);
    },
  });
};

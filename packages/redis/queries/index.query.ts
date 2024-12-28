import type { RedisKey, RedisValue } from "ioredis";
import { createRedisQuery } from "../lib/create-redis-query";
import type { Dependencies } from "../lib/types";

export const pingRedisQuery = (dependencies: Dependencies) => {
  return createRedisQuery({
    dependencies,
    queryName: "pingRedis",
    query: (redis) => {
      return redis.ping();
    },
  });
};

export const setWithExpiry = (
  dependencies: Dependencies,
  key: RedisKey,
  value: RedisValue,
  expiryTime: number,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "setWithExpiryQuery",
    query: (redis) => {
      return redis.set(key, value, "EX", expiryTime);
    },
  });
};

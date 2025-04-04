import type { RedisKey, RedisValue } from "ioredis";
import { createRedisQuery } from "../lib/create-redis-query";
import type { Dependencies } from "../lib/types";

export const pingRedisQuery = (dependencies: Dependencies) => {
  return createRedisQuery({
    dependencies,
    queryName: "pingRedisQuery",
    query: async (redis) => {
      return await redis.ping();
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
    query: async (redis) => {
      return await redis.set(key, value, "EX", expiryTime);
    },
  });
};

export const deleteByKey = (dependencies: Dependencies, key: RedisKey) => {
  return createRedisQuery({
    dependencies,
    queryName: "deleteByKey",
    query: async (redis) => {
      return await redis.del(key);
    },
  });
};

export const getByKey = (dependencies: Dependencies, key: RedisKey) => {
  return createRedisQuery({
    dependencies,
    queryName: "deleteByKey",
    query: async (redis) => {
      return await redis.get(key);
    },
  });
};

export const doesKeyExists = (dependencies: Dependencies, key: RedisKey) => {
  return createRedisQuery({
    dependencies,
    queryName: "doesKeyExists",
    query: async (redis) => {
      return await redis.exists(key);
    },
  });
};

export const getSetMembers = (dependencies: Dependencies, key: RedisKey) => {
  return createRedisQuery({
    dependencies,
    queryName: "getSetMembers",
    query: async (redis) => {
      return await redis.smembers(key);
    },
  });
};

export const addToSet = (
  dependencies: Dependencies,
  key: RedisKey,
  members: any,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "addToSet",
    query: async (redis) => {
      return await redis.sadd(key, members);
    },
  });
};

export const removeFromSet = (
  dependencies: Dependencies,
  key: RedisKey,
  members: any,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "removeFromSet",
    query: async (redis) => {
      return await redis.srem(key, members);
    },
  });
};

export const acquireLock = (
  dependencies: Dependencies,
  key: RedisKey,
  value: RedisValue,
  expiryTime: number,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "acquireLockQuery",
    query: async (redis) => {
      return await redis.set(key, value, "EX", expiryTime, "NX");
    },
  });
};

export const releaseLock = (
  dependencies: Dependencies,
  key: RedisKey,
  value: RedisValue,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "releaseLockQuery",
    query: async (redis) => {
      const script = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
      else
          return 0
      end
    `;
      return await redis.eval(script, 1, key, value);
    },
  });
};

/* eslint-disable unused-imports/no-unused-vars */
import type { RedisKey, RedisValue } from "ioredis";
import type { Lock } from "redlock";
import type { Dependencies } from "../lib/types";
import {
  createRedisQuery,
  createRedlockQuery,
} from "../lib/create-redis-query";

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
    queryName: "getByKey",
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
  key: string,
  expiryTime: number,
): Promise<Lock | false> => {
  return createRedlockQuery({
    dependencies,
    queryName: "acquireLockQuery",
    query: async (redlock) => {
      try {
        const lock = await redlock.acquire([key], expiryTime * 1000);
        return lock;
      }
      catch (_) {
        return false;
      }
    },
  });
};

export const releaseLock = (dependencies: Dependencies, lock: Lock) => {
  return createRedlockQuery({
    dependencies,
    queryName: "releaseLockQuery",
    query: async (redlock) => {
      try {
        await redlock.release(lock);
        return true;
      }
      catch (_) {
        return false;
      }
    },
  });
};

export const hsetWithExpiry = (
  dependencies: Dependencies,
  key: RedisKey,
  field: string,
  value: RedisValue,
  expiryTime: number,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "hsetWithExpiry",
    query: async (redis) => {
      await redis.hset(key, field, value);
      return await redis.expire(key, expiryTime);
    },
  });
};

export const hexistsQuery = (
  dependencies: Dependencies,
  key: RedisKey,
  field: string,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "hexistsQuery",
    query: async (redis) => {
      return await redis.hexists(key, field);
    },
  });
};

export const hdelQuery = (
  dependencies: Dependencies,
  key: RedisKey,
  field: string,
) => {
  return createRedisQuery({
    dependencies,
    queryName: "hdelQuery",
    query: async (redis) => {
      return await redis.hdel(key, field);
    },
  });
};

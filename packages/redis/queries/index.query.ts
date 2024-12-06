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

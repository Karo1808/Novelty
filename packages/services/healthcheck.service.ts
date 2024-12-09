import { getStatusQuery } from "@novelty/db/queries/misc.query";
import { pingRedisQuery } from "@novelty/redis/queries/index.query";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { ServiceDependencies } from "./types";
import { prepareDependencies } from "./lib/utils";

export const checkDbHealth = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
) => {
  const deps = prepareDependencies(dependencies, "redisClient");

  return await getStatusQuery(deps);
};

export const checkRedisHealth = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "dbInstance">,
) => {
  const deps = prepareDependencies(dependencies, "dbInstance");

  return await pingRedisQuery(deps);
};

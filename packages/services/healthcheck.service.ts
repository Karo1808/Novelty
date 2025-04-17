import { getStatusQuery } from "@novelty/db/queries/misc.query";
import { pingRedisQuery } from "@novelty/redis/queries/index.query";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { ServiceDependencies } from "./types";
import { HeadBucketCommand } from "@aws-sdk/client-s3";

export const checkDbHealth = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "redisClient">,
) => {
  return await getStatusQuery(dependencies);
};

export const checkRedisHealth = async (
  dependencies: MarkKeysAsPartial<ServiceDependencies, "dbInstance">,
) => {
  return await pingRedisQuery(dependencies);
};

export const checkEmailQueueHealth = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "redisClient"]
  >,
) => {
  return await dependencies.messageQueueInstance?.getJobCounts();
};

export const checkR2Health = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "redisClient"]
  >,
) => {
  return await dependencies.s3Client?.send(
    new HeadBucketCommand(
      // eslint-disable-next-line node/no-process-env
      { Bucket: process.env.R2_BUCKET_NAME },
    ),
  );
};

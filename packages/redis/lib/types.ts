import type { Redis } from "ioredis";
import type { Logger } from "@novelty/lib/types";
import type { Registry } from "prom-client";

export interface Dependencies {
  redisClient: Redis;
  reqId: string;
  logger: Logger;
  prometheusRegistry: Registry;
}

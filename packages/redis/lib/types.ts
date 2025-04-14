import type { Redis } from "ioredis";
import type { Logger } from "@novelty/lib/types";
import type { Registry } from "prom-client";
import type Redlock from "redlock";

export interface Dependencies {
  redisClient: Redis;
  redlockClient?: Redlock;
  reqId: string;
  logger: Logger;
  prometheusRegistry: Registry;
}

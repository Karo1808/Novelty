import { HttpStatusCodes } from "@/lib/http-status-codes";
import logger from "@/lib/logger";
import { prometheusRegistry, rateLimitCounter } from "@/lib/metrics";
import { getConnInfo } from "@hono/node-server/conninfo";
import { redis } from "@novelty/redis";
import type { Store } from "hono-rate-limiter";
import { rateLimiter } from "hono-rate-limiter";
import { RedisStore } from "rate-limit-redis";

const redisStore = new RedisStore({
  // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
  sendCommand: (...args: string[]) => redis.call(...args),
}) as unknown as Store;

const mainConfig = {
  windowMs: 1 * 60 * 1000,
  limit: 100,
};

export const mainLimiter = rateLimiter({
  windowMs: mainConfig.windowMs,
  limit: mainConfig.limit,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    const info = getConnInfo(c);
    return `rate-limit:${info.remote.address}`;
  },
  handler: (c) => {
    const info = getConnInfo(c);

    rateLimitCounter(prometheusRegistry).inc({
      path: c.req.path,
      method: c.req.method,
    });

    logger.warn({
      event: "rate-limit-exceeded",
      path: c.req.path,
      method: c.req.method,
      url: c.req.url,
      userAgent: c.req.header()["user-agent"],
      query: c.req.query(),
      ip: info.remote.address,
      reqId: c.var.requestId,
    });

    c.var.sentry.captureEvent({
      message: "Rate limit exceeded",
      level: "warning",
      tags: {
        path: c.req.path,
        method: c.req.method,
      },
      extra: {
        ip: info.remote.address,
        userAgent: c.req.header()["user-agent"],
        query: c.req.query(),
        requestId: c.var.requestId,
      },
    });

    return c.json(
      {
        message: "Too many requests, try again later",
      },
      HttpStatusCodes.TOO_MANY_REQUESTS,
    );
  },
  store: redisStore,
});

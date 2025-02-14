import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import type { User } from "@/types/index.types";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis } from "@novelty/redis";
import { validateSessionToken } from "@novelty/services/session.service";
import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const authMiddleware = (): MiddlewareHandler => {
  return createMiddleware<{ Variables: { user: User } }>(async (c, next) => {
    const sessionToken = getCookie(c, "session");
    if (!sessionToken?.trim()) {
      logger.warn("Auth failed: Missing session token", {
        requestId: c.var.requestId,
      });

      return c.json(
        { message: "Unauthorized", status: HttpStatusCodes.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED,
      );
    }

    const session = await validateSessionToken(
      {
        logger,
        prometheusRegistry,
        redisClient: redis,
        reqId: c.var.requestId,
      },
      sessionToken,
    );

    if (!session) {
      logger.warn("Auth failed: Invalid session token", {
        requestId: c.var.requestId,
        sessionToken,
      });

      return c.json(
        { message: "Unauthorized", status: HttpStatusCodes.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED,
      );
    }

    c.set("user", { userId: session.userId, sessionId: session.id });

    await next();
  });
};

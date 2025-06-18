import type { User } from "@/types/index.types";
import type { MiddlewareHandler } from "hono";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { db } from "@novelty/db";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { redis } from "@novelty/redis";
import {
  SESSION_EXPIRATION_TIME,
  validateSessionToken,
} from "@novelty/services/session.service";
import { getCookie, setCookie } from "hono/cookie";
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
        dbInstance: db,
        reqId: c.var.requestId,
      },
      sessionToken,
    );

    if (!session) {
      logger.warn("Auth failed: Invalid session token", {
        requestId: c.var.requestId,
      });

      return c.json(
        { message: "Unauthorized", status: HttpStatusCodes.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED,
      );
    }

    c.set("user", { userId: session.userId, sessionId: session.id });

    if (session.token) {
      setCookie(c, "session", session.token, {
        maxAge: SESSION_EXPIRATION_TIME / 1000,
        expires: session.expiresAt,
      });
    }

    await next();
  });
};

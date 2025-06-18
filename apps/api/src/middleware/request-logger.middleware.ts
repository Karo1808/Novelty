import type { MiddlewareHandler } from "hono";
import type { Logger } from "pino";

import logger from "@/lib/logger";
import { getConnInfo } from "@hono/node-server/conninfo";

import { HttpStatusText } from "@novelty/lib/http-status-codes";
import { createMiddleware } from "hono/factory";

export const requestLogger = (): MiddlewareHandler => {
  return createMiddleware<{ Variables: { logger: Logger } }>(
    async (c, next) => {
      if (c.req.path === "/metrics") {
        await next();
        return;
      }

      const startTime = Date.now();

      c.set("logger", logger);

      const info = getConnInfo(c);

      logger.info(
        {
          method: c.req.method,
          path: c.req.path,
          url: c.req.url,
          headers: c.req.header(),
          query: c.req.query(),
          ip: info.remote.address,
          reqId: c.var.requestId,
        },
        "Incoming request",
      );

      await next();

      const duration = Date.now() - startTime;
      logger.info(
        {
          method: c.req.method,
          url: c.req.url,
          status: c.res.status,
          statusText: HttpStatusText[c.res.status],
          duration: `${duration}ms`,
          reqId: c.var.requestId,
        },
        "Request processed",
      );
    },
  );
};

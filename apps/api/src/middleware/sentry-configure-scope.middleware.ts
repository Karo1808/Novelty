import env from "@/env";
import { getConnInfo } from "@hono/node-server/conninfo";
import type { MiddlewareHandler } from "hono";

export const sentryConfigureScope = (): MiddlewareHandler => {
  return async (c, next) => {
    const sentry = c.get("sentry");

    if (sentry) {
      sentry.setTag("serverEnvironment", env.NODE_ENV ?? "development");
      sentry.setTag("requestId", c.var.requestId);

      const userId = c.req.header("x-user-id");
      const userEmail = c.req.header("x-user-email");

      if (userId) {
        sentry.setUser({
          id: userId,
          email: userEmail,
        });
      }

      sentry.addBreadcrumb({
        category: "request",
        message: `User ${userId ?? "unknown"} accessed ${c.req.url}`,
        level: "info",
      });

      const info = getConnInfo(c);

      sentry.setContext("request", {
        method: c.req.method,
        url: c.req.url,
        headers: c.req.header(),
        ip: info.remote.address,
      });

      await next();
    }
  };
};

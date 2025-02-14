import * as Sentry from "@sentry/node";
import type { MiddlewareHandler } from "hono";
import type { Span } from "@sentry/core";
import { createMiddleware } from "hono/factory";

export const sentryTransactionMiddleware = (): MiddlewareHandler => {
  return createMiddleware<{ Variables: { sentrySpan: Span } }>(
    async (c, next) => {
      Sentry.startSpan(
        {
          name: `${c.req.method} ${c.req.url}`,
          op: "http.server",
        },
        async (rootSpan) => {
          try {
            c.set("sentrySpan", rootSpan);
          }
          catch (error) {
            rootSpan.setStatus({
              code: 2,
            });
            rootSpan.setAttribute("error.message", (error as Error).message);
            Sentry.captureException(error);
            throw error;
          }
          finally {
            rootSpan.end();
          }
        },
      );
      await next();
    },
  );
};

import type { Hook } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";

import { OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import type { AppBindings, AppOpenAPI } from "@/types/index.types";

import notFound from "@/middleware/not-found.middleware";
import onError from "@/middleware/on-error.middleware";
import { requestLogger } from "@/middleware/request-logger.middleware";

import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { sentry } from "@hono/sentry";
import env from "@/env";
import { sentryConfigureScope } from "@/middleware/sentry-configure-scope.middleware";
import { sentryTransactionMiddleware } from "@/middleware/sentry-transaction.middleware";
// import { mainLimiter } from "@/middleware/rate-limit";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(compress());
  app.use(cors());
  app.use(secureHeaders());
  app.use("*", requestId());
  app.use("*", sentryTransactionMiddleware());
  app.use("*", sentry({ dsn: env.SENTRY_DSN }));
  app.use("*", sentryConfigureScope());
  app.use(requestLogger());
  // app.use("/rate-limit", mainLimiter);

  app.onError(onError);
  app.notFound(notFound);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}

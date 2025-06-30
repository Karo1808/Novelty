import type { AppBindings, AppOpenAPI } from "@/types/index.types";
import type { Hook } from "@hono/zod-openapi";

import env from "@/env";
import { authMiddleware } from "@/middleware/auth.middleware";
import notFound from "@/middleware/not-found.middleware";
import onError from "@/middleware/on-error.middleware";

import { emailVerificationLimiter, mainLimiter } from "@/middleware/rate-limit";

import { requestLogger } from "@/middleware/request-logger.middleware";
import { sentryConfigureScope } from "@/middleware/sentry-configure-scope.middleware";
import { sentryTransactionMiddleware } from "@/middleware/sentry-transaction.middleware";

import { sentry } from "@hono/sentry";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

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
  if (env.NODE_ENV !== "test") {
    app.use("*", sentry({ dsn: env.SENTRY_DSN }));
    app.use("*", sentryConfigureScope());
  }
  app.use(requestLogger());

  // AUTH
  app.use("/auth/send-verification-email", emailVerificationLimiter);
  app.use("/auth/verify-email", emailVerificationLimiter);
  app.use("/auth/logout", authMiddleware());
  app.use("/auth/send-forgot-password-email", emailVerificationLimiter);
  app.use("/auth/me", authMiddleware(), mainLimiter);

  // USER
  app.use("/user/*", authMiddleware());

  app.onError(onError);
  app.notFound(notFound);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}

import type { Hook } from "@hono/zod-openapi";

import { OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import type { AppBindings } from "@/types/index.types";

import notFound from "@/middleware/not-found.middleware";
import onError from "@/middleware/on-error.middleware";
import { pinoLogger } from "@/middleware/pino-logger.middleware";

import { HttpStatusCodes } from "./http-status-codes";

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
  app.use(pinoLogger());
  app.use(cors());
  app.use(secureHeaders());

  app.onError(onError);
  app.notFound(notFound);

  return app;
}

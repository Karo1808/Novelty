import type {
  OpenAPIHono,
  RouteConfig,
  RouteHandler,
  z,
} from "@hono/zod-openapi";
import type { Span } from "@sentry/core";
import type { PinoLogger } from "hono-pino";

export interface User {
  userId: string;
  sessionId: string;
}

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    sentrySpan: Span;
    user: User;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type ZodSchema =
  // @ts-expect-error error
  z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

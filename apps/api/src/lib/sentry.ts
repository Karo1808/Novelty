import env from "@/env";
import * as Sentry from "@sentry/node";
import type { Context, Scope } from "@sentry/types";

interface CaptureExceptionParams {
  error: Error;
  context?: Context;
  contextName?: string; // Optional for less verbosity
  breadcrumb?: Sentry.Breadcrumb;
}

export const captureException = ({
  error,
  context,
  contextName = "general",
  breadcrumb,
}: CaptureExceptionParams) => {
  Sentry.withScope((scope: Scope) => {
    scope.setTag("serverEnvironment", env.NODE_ENV ?? "development");

    if (context) {
      scope.setContext(contextName, context);
    }

    if (breadcrumb) {
      scope.addBreadcrumb({
        category: breadcrumb.category || "application",
        message: breadcrumb.message || "An error occurred",
        level: breadcrumb.level || "info",
        ...breadcrumb,
      });
    }

    Sentry.captureException(error);
  });
};

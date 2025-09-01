import type { Context, Primitive } from "@sentry/core";
import * as Sentry from "@sentry/node";
import type { NodeEnvironment } from "./types";

interface CaptureExceptionParams {
  error: unknown;
  context?: Context;
  contextName?: string;
  breadcrumb?: Sentry.Breadcrumb;
  nodeEnvironment?: NodeEnvironment;
  tags?: { name: string; value: Primitive }[];
}

export function captureException({
  error,
  context,
  contextName = "general",
  breadcrumb,
  nodeEnvironment = "development",
  tags = [],
}: CaptureExceptionParams): void {
  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === "string" ? error : "Unknown error");

  Sentry.withScope((scope) => {
    const tagsToApply = [
      ...tags,
      { name: "nodeEnvironment", value: nodeEnvironment },
    ];

    for (const tag of tagsToApply) {
      scope.setTag(tag.name, String(tag.value));
    }

    if (context) {
      scope.setContext(contextName ?? "general", context);
    }

    if (breadcrumb) {
      scope.addBreadcrumb({
        ...breadcrumb,
        category: breadcrumb.category ?? "application",
        message: breadcrumb.message ?? "An error occurred",
        level: breadcrumb.level ?? "info",
      });
    }

    Sentry.captureException(err);
  });
}

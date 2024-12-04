import * as Sentry from "@sentry/node";
import type { Context, Primitive, Scope } from "@sentry/types";
import type { NodeEnvironment } from "./types";

interface CaptureExceptionParams {
  error: Error;
  context?: Context;
  contextName?: string;
  breadcrumb?: Sentry.Breadcrumb;
  nodeEnvironment?: NodeEnvironment;
  tags?: {
    name: string;
    value: Primitive;
  }[];
}

export const captureException = ({
  error,
  context,
  contextName = "general",
  breadcrumb,
  nodeEnvironment = "development",
  tags,
}: CaptureExceptionParams) => {
  Sentry.withScope((scope: Scope) => {
    tags?.push({
      name: "nodeEnvironment",
      value: nodeEnvironment,
    });

    if (tags && tags.length) {
      tags.forEach((tag) => {
        scope.setTag(tag.name, tag.value);
      });
    }

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

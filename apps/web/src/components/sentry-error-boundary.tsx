// src/components/sentry-error-boundary.tsx
import * as Sentry from "@sentry/tanstackstart-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorBoundary as RouterErrorScreen } from "./error-boundary";

/**
 * Same visual component ➜ now also reports to Sentry.
 * No extra type annotations needed – let TS infer the correct shape.
 */
export const SentryErrorBoundary =
  Sentry.withErrorBoundary<ErrorComponentProps>( // 👈 keeps the same prop signature
    RouterErrorScreen, // the screen you already wrote
    {
      /** Render the same screen if something below throws */
      // @ts-ignore
      fallback: ({ error }) => <RouterErrorScreen error={error} />,

      /** Optional – pops Sentry’s feedback modal for end-users */
      showDialog: true,
    },
  );

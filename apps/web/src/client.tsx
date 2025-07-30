import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

import * as Sentry from "@sentry/tanstackstart-react";

const router = createRouter();

Sentry.init({
  dsn: "https://c73f7a4d40453e78fb70eeb7a2580ec7@o4508002054635520.ingest.de.sentry.io/4508375750738000",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [
    Sentry.tanstackRouterBrowserTracingIntegration(router),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error.
  // Learn more at https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

hydrateRoot(document, <StartClient router={router} />);

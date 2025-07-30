import * as Sentry from "@sentry/tanstackstart-react";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";

Sentry.init({
  dsn: "https://c73f7a4d40453e78fb70eeb7a2580ec7@o4508002054635520.ingest.de.sentry.io/4508375750738000",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
});

export default createStartHandler({
  createRouter,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import "dotenv/config";

// eslint-disable-next-line node/no-process-env
if (process.env.SENTRY_DSN) {
  Sentry.init({
    // eslint-disable-next-line node/no-process-env
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import "dotenv/config";

Sentry.init({
  dsn: "https://c73f7a4d40453e78fb70eeb7a2580ec7@o4508002054635520.ingest.de.sentry.io/4508375750738000",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  // eslint-disable-next-line node/no-process-env
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1, //  Capture 100% of the transactions
  profilesSampleRate: 0.5,
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: "Index",
  },
  () => {},
);

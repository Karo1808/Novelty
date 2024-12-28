import env from "@/env";
import { configureLogger } from "@novelty/lib/logger";

const logger = configureLogger({
  nodeEnvironment: env.NODE_ENV ?? "development",
  hostUrl: `${env.BASE_URL}:${env.LOKI_PORT}`,
  labels: {
    source: "api",
    environment: env.NODE_ENV,
  },
  logLevel: env.LOG_LEVEL ?? "info",
});

export default logger;

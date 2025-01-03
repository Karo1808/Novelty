import { configureLogger } from "@novelty/lib/logger";
import env from "./env";

export const logger = configureLogger({
  nodeEnvironment: env.NODE_ENV,
  hostUrl: `${env.BASE_URL}:${env.LOKI_PORT}`,
  labels: {
    source: "message queue",
    environment: env.NODE_ENV,
  },
  logLevel: env.LOG_LEVEL,
});

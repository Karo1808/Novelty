import { pino } from "pino";

import env from "@/env";

const transports: any[] = [];

if (env.NODE_ENV !== "production") {
  transports.push({
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: true,
      level: env.LOG_LEVEL ?? "info",
    },
  });
}

if (env.NODE_ENV !== "test") {
  transports.push({
    target: "pino-loki",
    options: {
      batching: true,
      interval: 5,
      host: `${env.BASE_URL}:${env.LOKI_PORT}`,
      labels: {
        application: "api",
        environment: env.NODE_ENV,
      },
    },
  });
}

const logger = pino({
  transport: transports.length > 0 ? { targets: transports } : undefined,
});

export default logger;

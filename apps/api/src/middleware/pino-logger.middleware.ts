import dayjs from "dayjs";
import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/env";

const token = env.LOG_TOKEN;

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: true,
                ignore: "pid,hostname",
                level: env.LOG_LEVEL || "info",
              },
            },
            {
              target: "@logtail/pino",
              options: {
                sourceToken: token,
              },
            },
          ],
        },
        base: {
          pid: false,
        },
        timestamp: () => `,"time":"${dayjs().format()}"`,
      },
      env.NODE_ENV === "production"
        ? undefined
        : pretty({
          colorize: true,
          translateTime: true,
        }),
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}

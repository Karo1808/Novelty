import type { LoggerOptions, TransportMultiOptions } from "pino";
import { pino } from "pino";
import type { LokiOptions } from "pino-loki";
import type { PrettyOptions } from "pino-pretty";

interface LoggerParams {
  nodeEnvironment: "development" | "production" | "test" | "debug";
  logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  hostUrl: string;
  labels: LokiOptions["labels"];
}

export const configureLogger = ({
  nodeEnvironment,
  logLevel = "info",
  hostUrl,
  labels,
}: LoggerParams) => {
  const targets: TransportMultiOptions["targets"] = [
    ...(nodeEnvironment !== "production"
      ? [
          {
            target: "pino-pretty",
            level: logLevel,
            options: {
              colorize: true,
              translateTime: true,
            } as PrettyOptions,
          },
        ]
      : []),

    ...(nodeEnvironment !== "test"
      ? [
          {
            target: "pino-loki",
            level: logLevel,
            options: {
              batching: true,
              interval: 5,
              host: hostUrl,
              labels,
            } as LokiOptions,
          },
        ]
      : []),
  ];

  const transport: TransportMultiOptions = {
    targets,
  };

  const pinoConfig: LoggerOptions = {
    transport,
  };

  return pino(pinoConfig);
};

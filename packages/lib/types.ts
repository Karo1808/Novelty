import type { BaseLogger } from "pino";

export type NodeEnvironment = "development" | "production" | "test" | "debug";
export type LogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "silent";
export type Logger = BaseLogger;

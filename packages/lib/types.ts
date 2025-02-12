import type { BaseLogger } from "pino";
import type { Registry } from "prom-client";

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

export type PrometheusRegistry = Registry;

export type RequireAllExcept<T, K extends keyof T> = Required<Omit<T, K>> &
  Pick<T, K>;

export type MarkKeysAsPartial<
  T,
  K extends keyof T | readonly (keyof T)[],
> = Omit<T, K extends readonly (keyof T)[] ? K[number] : K> &
  Partial<Pick<T, K extends readonly (keyof T)[] ? K[number] : K>>;

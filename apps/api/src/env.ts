/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === "test" ? ".env.test" : ".env.local",
    ),
  }),
);

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["test", "debug", "development", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  BASE_URL: z.string().default("http://localhost"),
  PROMETHEUS_PORT: z.coerce.number().default(9090),
  GRAFANA_PORT: z.coerce.number().default(3000),
  NODE_EXPORTER_PORT: z.coerce.number().default(9100),
  LOKI_PORT: z.coerce.number().default(3100),
  PROMTAIL_PORT: z.coerce.number().default(9080),
  SENTRY_DSN: z.string().default(""),
  IS_OPEN_API_GENERATE: z.coerce.number().default(0),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;

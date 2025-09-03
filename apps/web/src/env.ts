import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["test", "debug", "development", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3002),
  BASE_URL: z.string().default("http://localhost"),
  BASE_SERVER_URL: z.string().default("http://localhost:3001"),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  // oxlint-disable-next-line no-console
  console.error("❌ Invalid env:");
  // oxlint-disable-next-line no-console
  console.error(JSON.stringify(z.treeifyError(error).errors, null, 2));
  process.exit(1);
}

export default env!;

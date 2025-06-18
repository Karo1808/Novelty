import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

configDotenv({ path: ".env.local" });

export default defineConfig({
  out: "./migrations",
  schema: "./schemas/index.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.DATABASE_URL || "",
  },
});

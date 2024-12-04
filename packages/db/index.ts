/* eslint-disable node/no-process-env */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/index.schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing environment variable, DATABASE_URL");
}

export const db = drizzle(databaseUrl, { schema });

/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/index.schema";

config({ path: ".env.local" });

interface ConnectToDBParams {
  databaseUrl?: string;
}

export const connectToDB = ({
  databaseUrl = process.env.DATABASE_URL,
}: ConnectToDBParams) => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  const db = drizzle(databaseUrl, { schema });
  return db;
};

export const db = connectToDB({
  databaseUrl: undefined,
});

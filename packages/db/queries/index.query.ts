import { createDBQuery } from "@/lib/create-db-query";
import type { DBClient } from "@/types/index.type";
import { sql } from "drizzle-orm";

interface QueryParams {
  db: DBClient;
}

export const getDbStatus = ({ db }: QueryParams) =>
  createDBQuery({
    dbInstance: db,
    queryName: "getDbStatus",
    query: async (db) => {
      return await db.execute(sql`SELECT 1`);
    },
  });

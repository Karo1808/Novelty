import type { Dependencies } from "../lib/types";
import { sql } from "drizzle-orm";
import { createDBQuery } from "../lib/create-db-query";

export const getStatusQuery = (dependencies: Dependencies) => {
  return createDBQuery({
    dependencies,
    queryName: "getDbStatus",
    query: (db) => {
      return db.execute(sql`SELECT 1`);
    },
  });
};

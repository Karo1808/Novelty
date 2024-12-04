import type { Dependencies } from "@novelty/db/lib/types";
import { getStatusQuery } from "@novelty/db/queries/misc.query";

export const checkDatabaseHealth = async (dependencies: Dependencies) => {
  return await getStatusQuery(dependencies);
};

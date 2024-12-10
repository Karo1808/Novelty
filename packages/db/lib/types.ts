import type { db } from "..";
import type { Logger } from "@novelty/lib/types";
import type { Registry } from "prom-client";

export type DBClient = typeof db;

export interface Dependencies {
  dbInstance: Omit<DBClient, "$client"> | DBClient;
  reqId: string;
  logger: Logger;
  prometheusRegistry: Registry;
}

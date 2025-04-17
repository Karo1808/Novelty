import type { db } from "..";
import type { Logger } from "@novelty/lib/types";
import type { Registry } from "prom-client";
import { selectUserSchema } from "../schemas/user.schema";
import { selectUserInfoSchema } from "../schemas/user-info.schema";
import type { z } from "zod";

export type DBClient = typeof db;

export interface Dependencies {
  dbInstance: Omit<DBClient, "$client"> | DBClient;
  reqId: string;
  logger: Logger;
  prometheusRegistry: Registry;
}

export const selectUserWithInfoSchema = selectUserSchema.extend({
  userInfo: selectUserInfoSchema,
});

export type SelectUserWithInfo = z.infer<typeof selectUserWithInfoSchema>;

import type { Logger } from "@novelty/lib/types";
import type { Registry } from "prom-client";
import type { z } from "zod/v4";
import type { db } from "..";
import { selectUserInfoSchema } from "../schemas/user-info.schema";
import { selectUserSchema } from "../schemas/user.schema";

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

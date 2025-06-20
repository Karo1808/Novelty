import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { usersTable } from "./user.schema";

export const providerEnum = pgEnum("auth_provider_enum", [
  "email",
  "google",
  "amazon",
]);

export const authProvidersTable = pgTable("auth_providers", {
  id: varchar({ length: 255 })
    .$default(() => nanoid())
    .primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  provider: providerEnum().notNull(),
  providerUserId: varchar("provider_user_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const authProviderRelations = relations(
  authProvidersTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [authProvidersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

const baseSchema = createInsertSchema(authProvidersTable);

export const selectAuthProviderSchema = createSelectSchema(authProvidersTable);

export const insertAuthProviderSchema = z.object({
  init: z.object({
    provider: baseSchema.shape.provider,
  }),
  callback: z
    .object({
      provider: baseSchema.shape.provider,
      providerId: z.string(),
    })
    .optional(),
  authenticate: z.object({
    provider: baseSchema.shape.provider,
    userId: baseSchema.shape.userId,
    providerUserId: baseSchema.shape.providerUserId,
  }),
});

export type SelectAuthProvider = z.infer<typeof selectAuthProviderSchema>;
export type InsertAuthProvider = z.infer<typeof insertAuthProviderSchema>;

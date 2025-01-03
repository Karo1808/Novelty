import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: varchar({ length: 255 })
    .$default(() => nanoid())
    .primaryKey(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  isEmailVerified: boolean("is_email_verified")
    .notNull()
    .$default(() => false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

const baseSchema = createInsertSchema(usersTable, {
  email: schema => schema.email(),
  password: schema => schema.min(1),
}).pick({
  email: true,
  password: true,
});

export const selectUserSchema = createSelectSchema(usersTable).omit({
  password: true,
});

export const insertUserSchema = z.object({
  register: z.object({
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
  }),
  sendVerificationEmail: z.object({
    email: baseSchema.shape.email,
  }),
});

export type SelectUser = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

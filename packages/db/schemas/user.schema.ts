import { relations } from "drizzle-orm";
import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod/v4";
import { authProvidersTable } from "./auth-provider.schema";
import { userInfoTable } from "./user-info.schema";

export const usersTable = pgTable("users", {
  id: varchar({ length: 255 })
    .$default(() => nanoid())
    .primaryKey(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }),
  isEmailVerified: boolean("is_email_verified")
    .notNull()
    .$default(() => false),
  isOnboarded: boolean("is_onboarded")
    .notNull()
    .$default(() => false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(usersTable, ({ one, many }) => ({
  userInfo: one(userInfoTable),
  authProvider: many(authProvidersTable),
}));

const baseSchema = createInsertSchema(usersTable, {
  email: (schema) => schema.check(z.email()),
  password: (schema) => schema.min(1).optional(),
}).pick({
  email: true,
  password: true,
  isEmailVerified: true,
});

export const selectUserSchema = createSelectSchema(usersTable).omit({
  password: true,
});

export const oauthProviderSchema = z.enum(["google", "amazon"]);

export const insertUserSchema = z.object({
  register: z.object({
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
    isEmailVerified: baseSchema.shape.isEmailVerified,
  }),
  sendEmail: z.object({
    email: baseSchema.shape.email,
  }),
  login: z.object({
    email: baseSchema.shape.email,
    password: baseSchema.shape.password,
  }),
  registerFormEmail: z
    .object({
      email: baseSchema.shape.email,
      password: baseSchema.shape.password,
      confirmPassword: z.string(),
      terms: z.boolean().refine((val) => val, {
        message: "You must accept the Terms of Service",
      }),
      promotional: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export const updateUserSchema = createUpdateSchema(usersTable).omit({
  createdAt: true,
  id: true,
  updatedAt: true,
});

export type SelectUser = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

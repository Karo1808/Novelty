import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { imageFileSchema } from "../lib/schemas";
import { usersTable } from "./user.schema";

export const userInfoTable = pgTable("user_info", {
  id: varchar({ length: 255 })
    .$default(() => nanoid())
    .primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .unique(),
  username: varchar({ length: 255 }).unique(),
  avatarUrl: text("avatar_url"),
  bio: text(),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userInfoRelations = relations(userInfoTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userInfoTable.userId],
    references: [usersTable.id],
  }),
}));

export const userPreferencesSchema = z.object({
  genres: z.array(z.string()).min(3, { error: "Select at least 3 genres" }), // ✅
  authors: z.array(z.string()).optional(),
  series: z.array(z.string()).optional(),
});

export const baseSelectSchema = createSelectSchema(userInfoTable, {
  preferences: userPreferencesSchema,
});

export const selectUserInfoSchema = z.object({
  profile: z.object({
    username: baseSelectSchema.shape.username,
    avatarUrl: baseSelectSchema.shape.avatarUrl,
    bio: baseSelectSchema.shape.bio,
  }),
  preferences: z.object({
    genres: baseSelectSchema.shape.preferences.shape.genres,
    authors: baseSelectSchema.shape.preferences.shape.authors,
    series: baseSelectSchema.shape.preferences.shape.series,
  }),
});
export type SelectUserInfo = z.infer<typeof selectUserInfoSchema>;

const baseInsertSchema = createInsertSchema(userInfoTable, {
  username: (schema) => schema.min(4).optional(),
  avatarUrl: (schema) => schema.check(z.url()),
  bio: (schema) => schema.max(80),
  preferences: userPreferencesSchema,
});

export const insertUserInfoSchema = z.object({
  profile: z.object({
    username: baseInsertSchema.shape.username,
    avatarUrl: baseInsertSchema.shape.avatarUrl,
    bio: baseInsertSchema.shape.bio,
  }),
  preferences: z.object({
    genres: baseInsertSchema.shape.preferences.shape.genres,
    authors: baseInsertSchema.shape.preferences.shape.authors,
    series: baseInsertSchema.shape.preferences.shape.series,
  }),
});

export type InsertUserInfo = z.infer<typeof insertUserInfoSchema>;

export const baseUpdateSchema = createUpdateSchema(userInfoTable, {
  username: (s) =>
    s.min(4, { error: "Username must be at least 4 characters long" }),
  avatarUrl: () => z.url(),
  bio: (s) => s.max(80, { error: "bio must not exceed 80 characters" }),
  preferences: userPreferencesSchema,
});

export const updateProfileSchema = z.object({
  username: baseUpdateSchema.shape.username.optional(),
  bio: baseUpdateSchema.shape.bio.optional(),
  profileImage: imageFileSchema.optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const updateUserInfoSchema = z.object({
  profile: z.object({
    username: baseUpdateSchema.shape.username,
    profileImage: updateProfileSchema.shape.profileImage,
    bio: baseUpdateSchema.shape.bio,
  }),
  preferences: z.object({
    genres: baseUpdateSchema.shape.preferences.shape.genres,
    authors: baseUpdateSchema.shape.preferences.shape.authors,
    series: baseUpdateSchema.shape.preferences.shape.series,
  }),
});

export type UpdateUserInfo = z.infer<typeof updateUserInfoSchema>;

export const updateAllUserInfoSchema = z.object({
  username: baseUpdateSchema.shape.username,
  profileImage: updateProfileSchema.shape.profileImage,
  bio: baseUpdateSchema.shape.bio,
  genres: baseUpdateSchema.shape.preferences.shape.genres.optional(),
  authors: baseUpdateSchema.shape.preferences.shape.authors,
  series: baseUpdateSchema.shape.preferences.shape.series,
});

export type UpdateAllUserInfo = z.infer<typeof updateAllUserInfoSchema>;

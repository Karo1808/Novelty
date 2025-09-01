import { z } from "zod";

export const userDraftBodySchema = z.object({
  profile: z.object({
    username: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
  }),
  preferences: z.object({
    genres: z.string().array().optional(),
    authors: z.string().array().optional(),
    series: z.string().array().optional(),
  }),
});

export type UserDraftBodySchema = z.infer<typeof userDraftBodySchema>;

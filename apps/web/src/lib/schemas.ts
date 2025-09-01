import { updateProfileSchema } from "@/types";
import { updateUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import { z } from "zod";

export const updateOnboardingSchema = z.object({
  username: updateProfileSchema.shape.username,
  profileImage: updateProfileSchema.shape.profileImage,
  bio: updateProfileSchema.shape.bio,
  genres: updateUserInfoSchema.shape.preferences.shape.genres,
  authors: updateUserInfoSchema.shape.preferences.shape.authors,
  series: updateUserInfoSchema.shape.preferences.shape.series,
});

export type UpdateOnboarding = z.infer<typeof updateOnboardingSchema>;

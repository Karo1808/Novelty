import type { z } from "zod";
import { updateUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import { imageFileSchema } from "@novelty/lib/validations/file";

export const updateProfileSchema = updateUserInfoSchema.shape.profile
  .extend({
    profileImage: imageFileSchema,
  })
  .omit({
    avatarUrl: true,
  })
  .partial();

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const getOldKey = (url: string) => {
  return url.split(".r2.cloudflarestorage.com/")[1];
};

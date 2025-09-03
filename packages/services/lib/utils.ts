import { baseUpdateSchema } from "@novelty/db/schemas/user-info.schema";
import { imageFileSchema } from "@novelty/lib/validations/file";
import { z } from "zod";

export const updateProfileSchema = z.object({
  username: baseUpdateSchema.shape.username.optional(),
  bio: baseUpdateSchema.shape.bio.optional(),
  profileImage: imageFileSchema.optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const getOldKey = (url: string) => {
  return url.split(".r2.cloudflarestorage.com/")[1];
};

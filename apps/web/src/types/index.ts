import { updateUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import { imageFileSchema } from "@novelty/lib/validations/file";
import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";

export interface RootContext {
  queryClient: QueryClient;
}

export const updateProfileSchema = updateUserInfoSchema.shape.profile
  .extend({
    profileImage: imageFileSchema,
  })
  .partial();

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

import type { RequireAllExcept } from "@novelty/lib/types";
import type { ServiceDependencies } from "../types";
import { updateUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import { imageFileSchema } from "@novelty/lib/validations/file";
import type { z } from "zod";

export function prepareDependencies<T extends keyof ServiceDependencies>(
  dependencies: any,
  omittedKey: T,
): RequireAllExcept<ServiceDependencies, T> {
  const { [omittedKey]: optionalDep, ...rest } = dependencies;

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`Missing required dependency: ${key}`);
    }
  });

  return {
    ...rest,
    [omittedKey]: optionalDep,
  } as RequireAllExcept<ServiceDependencies, T>;
}

export const updateProfileSchema = updateUserInfoSchema.shape.profile
  .extend({
    profileImage: imageFileSchema,
  })
  .omit({
    avatarUrl: true,
  })
  .partial();

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

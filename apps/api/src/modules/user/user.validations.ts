import { selectUserInfoSchema } from "@novelty/db/schemas/user-info.schema";
import { z } from "@hono/zod-openapi";

export const getProfileSuccessSchema = z
  .object({
    userInfo: selectUserInfoSchema.shape.profile,
  })
  .openapi({
    example: {
      userInfo: {
        avatarUrl: "avatar:url",
        bio: "some-bio",
        username: "username",
      },
    },
  });

export const updateProfileConflictSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    examples: [
      {
        message: "This username already exists",
      },
    ],
  });

import { selectUserInfoSchema } from "@novelty/db/schemas/user-profile.schema";
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

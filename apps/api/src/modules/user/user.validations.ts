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

export const getPreferencesSuccessSchema = z
  .object({
    userPreferences: selectUserInfoSchema.shape.preferences,
  })
  .openapi({
    example: {
      userPreferences: {
        genres: ["fantasy", "sc-fi", "romance"],
        authors: ["Brandon Sanderson", "Stephen King"],
        series: ["Mistborn", "The Dark Tower"],
      },
    },
  });

export const completeOnboardingConflictSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    examples: [
      {
        message: "The user is already onboarded",
      },
    ],
  });

export const completeOnboardingMissingFields = z
  .object({
    message: z.string(),
  })
  .openapi({
    examples: [
      {
        message: "All required information must be provided",
      },
    ],
  });

export const getUserDraftSuccessSchema = z
  .object({
    userInfo: selectUserInfoSchema,
  })
  .openapi({
    example: {
      userInfo: {
        profile: {
          avatarUrl: "avatar:url",
          bio: "some-bio",
          username: "username",
        },
        preferences: {
          genres: ["fantasy", "sc-fi", "romance"],
          authors: ["Brandon Sanderson", "Stephen King"],
          series: ["Mistborn", "The Dark Tower"],
        },
      },
    },
  });

export const getUserDraftConflictSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    examples: [
      {
        message: "The cache is not empty",
      },
    ],
  });

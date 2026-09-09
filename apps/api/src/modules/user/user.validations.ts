import { z } from "@hono/zod-openapi";
import { selectUserWithInfoSchema } from "@novelty/db/lib/types";
import { selectUserInfoSchema } from "@novelty/db/schemas/user-info.schema";

export const getUserSuccessSchema = z
  .object({
    user: selectUserWithInfoSchema,
    success: z.literal(true),
  })
  .openapi({
    example: {
      success: true,
      user: {
        id: "V1StGXR8_Z5jdHi6B-myT",
        email: "email@mail.com",
        isEmailVerified: false,
        createdAt: "2024-12-09T12:34:56.789Z" as unknown as Date,
        updatedAt: "2024-12-09T12:34:56.789Z" as unknown as Date,
        isOnboarded: false,
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
    },
  });

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
    success: z.literal(false),
    message: z.string(),
  })
  .openapi({
    example: {
      message: "This username already exists",
      success: false,
    },
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
    success: z.literal(true),
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
      success: true,
    },
  });

export const getUserDraftConflictSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    examples: [
      {
        message: "The cache is not empty",
        success: false,
      },
    ],
  });

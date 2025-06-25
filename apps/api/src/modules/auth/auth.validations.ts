import { z } from "@hono/zod-openapi";
import { selectUserWithInfoSchema } from "@novelty/db/lib/types";
import { selectAuthProviderSchema } from "@novelty/db/schemas/auth-provider.schema";
import { selectUserSchema } from "@novelty/db/schemas/user.schema";

export const registerCreatedSchema = z
  .object({
    message: z.string(),
    user: selectUserSchema,
    success: z.literal(true),
  })
  .openapi({
    example: {
      message:
        "Registration successful. Please verify your email to activate your account.",
      success: true,
      user: {
        id: "V1StGXR8_Z5jdHi6B-myT",
        email: "email@mail.com",
        isEmailVerified: false,
        createdAt: "2024-12-09T12:34:56.789Z" as unknown as Date,
        updatedAt: "2024-12-09T12:34:56.789Z" as unknown as Date,
        isOnboarded: false,
      },
    },
  });

export const registerConflictSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      success: false,
      message: "An account with that email already exists.",
    },
  });

export const sendVerificationEmailSuccessSchema = z
  .object({
    message: z.string(),
    success: z.literal(true),
  })
  .openapi({
    example: {
      message: "Email verification sent successfully",
      success: true,
    },
  });

export const sendVerificationEmailNotFoundSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "This email does not exist",
      success: false,
    },
  });

export const sendVerificationEmailConflictSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Another process is already handling this email",
      success: false,
    },
  });

export const verifyEmailSuccessSchema = z
  .object({
    message: z.string(),
    success: z.literal(true),
  })
  .openapi({
    example: {
      message: "Email verified",
      success: true,
    },
  });

export const verifyEmailNotFoundSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "This user does not exist",
      success: false,
    },
  });

export const verifyEmailBadRequestSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "The code is incorrect or it has already expired",
      success: false,
    },
  });

export const verifyEmailConflictSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "This email has already been verified",
      success: false,
    },
  });

export const loginSuccessSchema = z
  .object({
    message: z.string(),
    user: selectUserWithInfoSchema,
    success: z.literal(true),
  })
  .openapi({
    example: {
      message: "Login successful",
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

export const loginUnauthorizedSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Invalid credentials",
      success: false,
    },
  });

export const oauthInitParamsSchema = z.object({
  provider: selectAuthProviderSchema.shape.provider.refine(
    (v) => v !== "email",
    {
      message: "The provider must be oauth",
    },
  ),
});

export type OauthInitParams = z.infer<typeof oauthInitParamsSchema>;

export const oAuthCallbackQuerySchema = z.object({
  state: z.string(),
  code: z.string(),
});

export type OAuthCallbackQuery = z.infer<typeof oAuthCallbackQuerySchema>;

export const logoutSuccessSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Logout successful",
    },
  });

export const forgotPasswordConflictSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Another process is already handling this email",
      success: false,
    },
  });

export const forgotPasswordSuccessSchema = z
  .object({
    message: z.string(),
    success: z.literal(true),
  })
  .openapi({
    example: {
      message: "Password successfully reset",
      success: true,
    },
  });

export const forgotPasswordSchema = z
  .object({
    message: z.string(),
    user: selectUserWithInfoSchema.optional(),
  })
  .openapi({
    example: {
      message: "Email verified",
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

export const oAuthInitSuccessSchema = z
  .object({
    url: z.url(),
    success: z.literal(true),
  })
  .openapi({
    example: {
      url: "https://accounts.google.com/o/oauth2/v2/auth",
      success: true,
    },
  });

import { z } from "@hono/zod-openapi";
import { selectUserWithInfoSchema } from "@novelty/db/lib/types";
import { selectAuthProviderSchema } from "@novelty/db/schemas/auth-provider.schema";
import { selectUserSchema } from "@novelty/db/schemas/user.schema";

export const registerCreatedSchema = z
  .object({
    message: z.string(),
    user: selectUserSchema,
  })
  .openapi({
    example: {
      message:
        "Registration successful. Please verify your email to activate your account.",
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
  })
  .openapi({
    example: {
      message: "An account with that email already exists.",
    },
  });

export const sendVerificationEmailSuccessSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Email verification sent successfully",
    },
  });

export const sendVerificationEmailNotFoundSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "This email does not exist",
    },
  });

export const sendVerificationEmailConflictSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Another process is already handling this email",
    },
  });

export const verifyEmailSuccessSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Email verified",
    },
  });

export const verifyEmailNotFoundSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "This user does not exist",
    },
  });

export const verifyEmailBadRequestSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "The code is incorrect or it has already expired",
    },
  });

export const verifyEmailConflictSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "This email has already been verified",
    },
  });

export const loginSuccessSchema = z
  .object({
    message: z.string(),
    user: selectUserWithInfoSchema,
  })
  .openapi({
    example: {
      message: "Login successful",
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
  })
  .openapi({
    example: {
      message: "Invalid credentials",
    },
  });

export const oauthInitParamsSchema = z.object({
  provider: selectAuthProviderSchema.shape.provider.refine(
    v => v !== "email",
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
  })
  .openapi({
    example: {
      message: "Another process is already handling this email",
    },
  });

export const forgotPasswordSuccessSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Password successfully reset",
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

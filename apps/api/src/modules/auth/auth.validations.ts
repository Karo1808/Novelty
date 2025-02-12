import { z } from "@hono/zod-openapi";
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

export type RegisterCreatedResponse = z.infer<typeof registerCreatedSchema>;

export const sendVerificationEmailSuccessSchema = z
  .object({
    message: z.string(),
    data: z.object({
      encryptedUserId: z.string(),
    }),
  })
  .openapi({
    example: {
      message: "Email verification sent successfully",
      data: {
        encryptedUserId: "encrypted_user_id",
      },
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
      message: "This email has already been verified",
    },
  });

export type SendVerificationEmailSuccessResponse = z.infer<
  typeof sendVerificationEmailSuccessSchema
>;

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

export type VerifyEmailSuccessResponse = z.infer<
  typeof verifyEmailSuccessSchema
>;

import { z } from "zod";

export const verifyEmailBodySchema = z.object({
  encryptedUserId: z.string().max(254),
  verificationCode: z.string().max(254),
});

export type VerifyEmailBodySchema = z.infer<typeof verifyEmailBodySchema>;

export const forgotPasswordBodySchema = z.object({
  token: z.string().max(254).min(1),
  newPassword: z.string().max(254).min(1),
});

export type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>;

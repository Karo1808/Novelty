import { z } from "zod";

export const verifyEmailBodySchema = z.object({
  encryptedUserId: z.string().max(254),
  verificationCode: z.string().max(254),
});

export type VerifyEmailBodySchema = z.infer<typeof verifyEmailBodySchema>;

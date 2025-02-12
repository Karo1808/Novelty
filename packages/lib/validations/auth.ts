import { z } from "zod";

export const verifyEmailBodySchema = z.object({
  encryptedUserId: z.string(),
  verificationCode: z.string(),
});

export type VerifyEmailBodySchema = z.infer<typeof verifyEmailBodySchema>;

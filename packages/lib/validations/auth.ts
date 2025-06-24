import { z } from "zod/v4";

export const verifyEmailBodySchema = z.object({
  email: z.email(),
  verificationCode: z
    .string()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export type VerifyEmailBodySchema = z.infer<typeof verifyEmailBodySchema>;

export const forgotPasswordBodySchema = z.object({
  token: z.string().max(254).min(1),
  newPassword: z.string().max(254).min(1),
});

export type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>;

export const oauthIdTokenSchema = z
  .object({
    // 1) Core OIDC checks
    iss: z.url(), // issuer
    aud: z.union([z.string(), z.array(z.string())]), // Audience
    exp: z.number(), // expiry

    // 2) User identifier
    sub: z.string(),

    email: z.email(),
    email_verified: z.boolean(),

    name: z.string().optional(),
    picture: z.url().optional(),
  })
  .refine(
    (claims) => {
      const now = Math.floor(Date.now() / 1000);
      return claims.exp > now;
    },
    {
      path: ["exp"],
      message: "Token has expired",
    },
  );
export type OAuthIdTokenSchema = z.infer<typeof oauthIdTokenSchema>;

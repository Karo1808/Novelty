import { z } from "@hono/zod-openapi";

export const serviceUnavailableSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message:
        "The server is currently unable to handle the request. Please try again later.",
    },
  });

export const tooManyRequestsSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Too many requests, try again later",
    },
  });

export const unauthenticatedSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "User must be authenticated",
    },
  });

export const accountNotFoundSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "This account does not exist",
    },
  });

export const ImageUnsupportedMediaSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Only JPEG, PNG, and WEBP images are allowed",
    },
  });

export const cookieSchema = z.object({
  cookie: z.string().openapi({
    example:
      "sessionId=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800",
  }),
});

export const blacklistedSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Access denied",
    },
  });

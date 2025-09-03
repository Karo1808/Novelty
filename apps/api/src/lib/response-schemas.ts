import { z } from "@hono/zod-openapi";

// Requests

// export const userUpdateFormSchema = zfd.formData({
//   username: zfd.text(z.string().min(1)).optional(),
//   bio: zfd.text(z.string()).optional(),
//   genres: zfd.repeatable(), // -> string[]
//   authors: zfd.repeatable().optional(), // -> string[]
//   series: zfd.repeatable().optional(), // -> string[]
//   // If you accept a file:
//   profileImage: zfd.file().optional(),
// });

// Headers

export const cookieSchema = z.object({
  cookie: z.string().openapi({
    example:
      "sessionId=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800",
  }),
});

export const locationSchema = z.object({
  Location: z.string().url().openapi({
    example: "http://localhost:3000/auth/redirect",
  }),
});

export const oAuthHeaderSchema = z.object({
  Location: z.string().url().openapi({
    example: "http://localhost:3000/auth/redirect",
  }),
  state: z.string().openapi({
    example: "generated-state",
  }),
  code_verifier: z.string().openapi({
    example: "generated-code-verifier",
  }),
});

// Responses

export const serviceUnavailableSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      success: false,
      message:
        "The server is currently unable to handle the request. Please try again later.",
    },
  });

export const tooManyRequestsSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Too many requests, try again later",
      success: false,
    },
  });

export const unauthenticatedSchema = z
  .object({
    success: z.literal(false),
    message: z.string(),
  })
  .openapi({
    example: {
      success: false,
      message: "User must be authenticated",
    },
  });

export const accountNotFoundSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "This account does not exist",
      success: false,
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

export const blacklistedSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Access denied",
      success: false,
    },
  });

export const csrfErrorSchema = z
  .object({
    message: z.string(),
    success: z.literal(false),
  })
  .openapi({
    example: {
      message: "Invalid or missing CSRF token.",
      success: false,
    },
    description: "Response returned when CSRF validation fails.",
  });

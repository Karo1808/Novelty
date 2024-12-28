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

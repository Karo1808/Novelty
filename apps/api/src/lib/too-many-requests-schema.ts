import { z } from "@hono/zod-openapi";

export const tooManyRequestsSchema = z
  .object({
    message: z.string(),
  })
  .openapi({
    example: {
      message: "Too many requests, try again later",
    },
  });

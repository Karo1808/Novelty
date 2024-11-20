import { z } from "@hono/zod-openapi";

export const healthcheckSchema = z
  .object({
    message: z.string(),
    success: z.boolean(),
  })
  .openapi({
    example: { message: "Healthcheck", success: true },
  });

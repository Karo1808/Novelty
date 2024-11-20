import { z } from "@hono/zod-openapi";

export const healthcheckSchema = z
  .object({
    status: z.literal("healthy"),
    environment: z.enum(["development", "production", "test", "debug"]),
  })
  .openapi({
    example: { status: "healthy", environment: "development" },
  });

import { z } from "@hono/zod-openapi";

export const healthcheckOkSchema = z
  .object({
    status: z.literal("healthy"),
    environment: z.enum(["development", "production", "test", "debug"]),
    readiness: z.object({
      database: z.literal("connected"),
    }),
  })
  .openapi({
    example: {
      status: "healthy",
      environment: "development",
      readiness: { database: "connected" },
    },
  });

export const healthcheckUnavailableSchema = z
  .object({
    status: z.literal("unhealthy"),
    environment: z.enum(["development", "production", "test", "debug"]),
    readiness: z.object({
      database: z.literal("disconnected"),
    }),
  })
  .openapi({
    example: {
      status: "unhealthy",
      environment: "development",
      readiness: { database: "disconnected" },
    },
  });

export type HealthcheckOKResponse = z.infer<typeof healthcheckOkSchema>;

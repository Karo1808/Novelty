import { z } from "@hono/zod-openapi";

export const healthcheckOkSchema = z
  .object({
    status: z.literal("healthy"),
    environment: z.enum(["development", "production", "test", "debug"]),
    readiness: z.object({
      database: z.literal("connected"),
      redis: z.literal("connected"),
      emailQueue: z.literal("connected"),
      r2: z.literal("connected"),
    }),
  })
  .openapi({
    example: {
      status: "healthy",
      environment: "development",
      readiness: {
        database: "connected",
        redis: "connected",
        emailQueue: "connected",
        r2: "connected",
      },
    },
  });

export const healthcheckUnavailableSchema = z
  .object({
    status: z.literal("unhealthy"),
    environment: z.enum(["development", "production", "test", "debug"]),
    readiness: z.object({
      database: z.enum(["connected", "disconnected"]),
      redis: z.enum(["connected", "disconnected"]),
      emailQueue: z.enum(["connected", "disconnected"]),
      r2: z.enum(["connected", "disconnected"]),
    }),
  })
  .openapi({
    example: {
      status: "unhealthy",
      environment: "development",
      readiness: {
        database: "disconnected",
        redis: "disconnected",
        emailQueue: "disconnected",
        r2: "disconnected",
      },
    },
  });

export type HealthcheckOKResponse = z.infer<typeof healthcheckOkSchema>;

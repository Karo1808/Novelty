import type { ZodSchema } from "@/types/index.types";

import { z } from "@hono/zod-openapi";

const createErrorSchema = <T extends ZodSchema>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.typeName === z.ZodArray ? [] : {},
  );
  return z.object({
    success: z.literal(false).openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: {
        message: "Something went wrong",
      },
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: error,
      }),
  });
};

export default createErrorSchema;

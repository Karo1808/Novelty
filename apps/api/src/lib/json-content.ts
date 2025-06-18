import type { ZodSchema } from "@/types/index.types";

export function jsonContent<T extends ZodSchema>(
  schema: T,
  description: string,
  isRequired = false,
  headers?: T,
) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required: isRequired,
    headers,
  };
}

export const jsonContentRequired = <T extends ZodSchema>(
  schema: T,
  description: string,
) => {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
};

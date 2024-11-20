import type { ZodSchema } from "@/types/index.types";

function jsonContent<T extends ZodSchema>(
  schema: T,
  description: string,
  isRequired = false,
) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required: isRequired,
  };
}

export default jsonContent;

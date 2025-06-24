import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { createServerFn } from "@tanstack/react-start";

export const registerFn = createServerFn({ method: "POST" })
  .validator(insertUserSchema.shape.register)
  .handler(async ({ data }) => {
    const response = await apiClient.auth.register.$post({ json: data });

    return await response.json();
  });

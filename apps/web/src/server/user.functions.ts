// TODO: Update with middleware

import { getAuthHeaders } from "@/lib/utils";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { createServerFn } from "@tanstack/react-start";
import { authenticationMiddleware } from "./middleware";

export const getUserFn = createServerFn({ method: "GET" })
  .middleware([authenticationMiddleware])
  .handler(async () => {
    const { cookies } = getAuthHeaders();

    const response = await apiClient.user.$get({
      header: cookies,
    });

    return await response.json();
  });

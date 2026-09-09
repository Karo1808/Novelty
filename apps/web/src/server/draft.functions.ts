import { UpdateOnboarding } from "@/lib/schemas";
import { getAuthHeaders } from "@/lib/utils";
import { type UserDraftBodySchema } from "@novelty/lib/validations/user";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { createServerFn } from "@tanstack/react-start";
import { authenticationMiddleware } from "./middleware";

export const getUserDraftFn = createServerFn({
  method: "GET",
})
  .middleware([authenticationMiddleware])
  .handler(async () => {
    const { cookies } = getAuthHeaders();

    const response = await apiClient.user.draft.$get({
      header: cookies,
    });

    const data = await response.json();

    if (!data.success) {
      return {};
    }

    return { data: data.userInfo };
  });

export const updateUserDraftFn = createServerFn({
  method: "POST",
})
  .middleware([authenticationMiddleware])
  .validator((data: UpdateOnboarding) => data)
  .handler(async ({ data }) => {
    const { cookies } = getAuthHeaders();

    const payload: UserDraftBodySchema = {
      preferences: {
        authors: data.authors,
        genres: data.genres,
        series: data.series,
      },
      profile: {
        username: data.username,
        bio: data.bio,
      },
    };

    await apiClient.user.draft.$put({
      json: payload,
      header: cookies,
    });
  });

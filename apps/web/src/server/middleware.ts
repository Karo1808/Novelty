import { getAuthHeaders } from "@/lib/utils";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

// TODO: Update to persist route
export const redirectToLogin = () => {
  throw redirect({ to: "/login" });
};

export const authenticationMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const { session, cookies } = getAuthHeaders();

  if (!session) {
    return redirectToLogin();
  }

  const response = await apiClient.user.$get({
    header: cookies,
  });

  if (response.status === HttpStatusCodes.UNAUTHORIZED) {
    return redirectToLogin();
  }

  const json = await response.json();

  if (json.success === false) {
    return redirectToLogin();
  }

  const user = json.user;

  return next({
    context: { userId: user.id, user },
  });
});

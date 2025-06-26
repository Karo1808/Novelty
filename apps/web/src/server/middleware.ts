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
  // @ts-ignore
}).server(async ({ next }) => {
  const { session, cookies } = getAuthHeaders();

  if (!session) {
    return next();
  }

  const response = await apiClient.auth.me.$get({
    header: cookies,
  });

  if (response.status === HttpStatusCodes.UNAUTHORIZED) {
    redirectToLogin();
  }

  const json = await response.json();

  if (json.success === false) {
    redirectToLogin();
  }

  return next({
    // @ts-expect-error: userId always defined here
    context: { userId: json.userId },
  });
});

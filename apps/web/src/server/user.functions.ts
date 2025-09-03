import { getAuthHeaders } from "@/lib/utils";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { authenticationMiddleware, redirectToLogin } from "./middleware";

export const getUserFn = createServerFn({ method: "GET" })
  .middleware([authenticationMiddleware])
  .handler(async () => {
    const { cookies } = getAuthHeaders();

    const response = await apiClient.user.$get({
      header: cookies,
    });

    return await response.json();
  });

const toUpdateUserForm = (fd: FormData) => {
  const pick = (k: string) => fd.get(k)?.toString() ?? "";
  const pickFile = (k: string) => fd.get(k) as File | null;

  // support both plain keys and [...]-style keys
  const pickAll = (k: string) => {
    const a = fd.getAll(`${k}[]`);
    const b = fd.getAll(k);
    const src = a.length ? a : b;
    return src.map((v) => v.toString());
  };

  return {
    username: pick("username") || undefined,
    bio: pick("bio") || undefined,
    profileImage: pickFile("profileImage") ?? undefined, // <-- File here
    genres: pickAll("genres"),
    authors: pickAll("authors"),
    series: pickAll("series"),
  } as const;
};

export const updateUserFn = createServerFn({ method: "POST" })
  .middleware([authenticationMiddleware])
  .validator(z.instanceof(FormData))
  .handler(async ({ data }) => {
    const { cookies } = getAuthHeaders();

    const user = await getUserFn();

    if (user.success === false) {
      redirectToLogin();
      return;
    }

    if (user.user.isOnboarded) {
      throw redirect({ to: "/user/profile/$userId", params: user.user.id });
    }

    const response = await apiClient.user.$patch({
      form: toUpdateUserForm(data),
      header: cookies,
    });

    if (response.status === 204) {
      return {};
    }

    return response.json();
  });

export const onboardFn = createServerFn({ method: "POST" })
  .middleware([authenticationMiddleware])
  .validator(z.instanceof(FormData))
  .handler(async ({ data }) => {
    const { cookies } = getAuthHeaders();

    const responseObject = await updateUserFn({ data });

    if ("message" in responseObject! || "success" in responseObject!) {
      return {
        stage: "update",
        response: responseObject,
      };
    }

    const response = await apiClient.user.onboarding.complete.$patch({
      header: cookies,
    });

    const onboardingObject = (await response.json()) as {};

    if ("success" in onboardingObject) {
      return {
        stage: "onboarding",
        response: onboardingObject,
      };
    }

    return onboardingObject;
  });

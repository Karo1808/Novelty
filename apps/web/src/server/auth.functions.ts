import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { parse } from "cookie";

export const registerFn = createServerFn({ method: "POST" })
  .validator(insertUserSchema.shape.register)
  .handler(async ({ data }) => {
    const response = await apiClient.auth.register.$post({ json: data });

    return await response.json();
  });

export const getPendingEmail = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    const raw =
      typeof document === "undefined"
        ? request.headers.get("cookie") || ""
        : document.cookie;

    const cookies = parse(raw);

    const email = cookies.pendingEmail;

    if (!email) {
      throw redirect({ to: "/register" });
    }

    return email;
  },
);

export const sendVerificationEmailFn = createServerFn({
  method: "POST",
})
  .validator(insertUserSchema.shape.registerFormEmail.shape.email)
  .handler(async ({ data }) => {
    const response = await apiClient.auth["send-verification-email"].$post({
      json: {
        email: data,
      },
    });

    return await response.json();
  });

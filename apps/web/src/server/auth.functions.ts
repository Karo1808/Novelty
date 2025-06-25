import { insertAuthProviderSchema } from "@novelty/db/schemas/auth-provider.schema";
import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import { verifyEmailBodySchema } from "@novelty/lib/validations/auth";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  appendResponseHeader,
  getWebRequest,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { parse } from "cookie";

// TODO: Update with middleware

export const registerFn = createServerFn({ method: "POST" })
  .validator(insertUserSchema.shape.register)
  .handler(async ({ data }) => {
    const response = await apiClient.auth.register.$post({ json: data });

    return await response.json();
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator(insertUserSchema.shape.login)
  .handler(async ({ data }) => {
    const response = await apiClient.auth.login.$post({ json: data });
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

export const verifyEmailFn = createServerFn({
  method: "POST",
})
  .validator(verifyEmailBodySchema)
  .handler(async ({ data }) => {
    const response = await apiClient.auth["verify-email"].$post({
      json: data,
    });

    return await response.json();
  });

export const oAuthFn = createServerFn({
  method: "GET",
  response: "raw",
})
  .validator(insertAuthProviderSchema.shape.init)
  .handler(async ({ data }) => {
    const apiRes = await apiClient.auth.oauth[":provider"].$get({
      param: data,
    });

    for (const [key, value] of apiRes.headers) {
      if (key.toLowerCase() !== "set-cookie") {
        continue;
      }

      for (const cookie of value.split(/,(?=[^;,]+=[^;,]+)/)) {
        appendResponseHeader("Set-Cookie", cookie.trim());
      }
    }

    setResponseStatus(apiRes.status);

    return await apiRes.json();
  });

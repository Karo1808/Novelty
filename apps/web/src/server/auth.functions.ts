import { getAuthHeaders } from "@/lib/utils";
import { insertAuthProviderSchema } from "@novelty/db/schemas/auth-provider.schema";
import { insertUserSchema } from "@novelty/db/schemas/user.schema";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { getCookieValue } from "@novelty/lib/misc/index";
import { verifyEmailBodySchema } from "@novelty/lib/validations/auth";
import { apiClient } from "@novelty/react-query/lib/api-client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  appendResponseHeader,
  deleteCookie,
  getCookie,
  setCookie,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { authenticationMiddleware } from "./middleware";

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

    const session =
      getCookieValue(response.headers.getSetCookie(), "session") ?? "";

    setCookie("session", session, {
      httpOnly: true,
      sameSite: "lax",
      // TODO: Update with env
      // secure: env.NODE_ENV === "production",
      path: "/",
      // TODO; update with age
    });

    return await response.json();
  });

export const logoutFn = createServerFn({ method: "POST" })
  .middleware([authenticationMiddleware])
  .handler(async () => {
    const { cookies } = getAuthHeaders();

    const response = await apiClient.auth.logout.$post({
      header: cookies,
    });

    if (response.status === HttpStatusCodes.OK) {
      deleteCookie("session");
    }

    return await response.json();
  });

export const getPendingEmail = createServerFn({ method: "GET" }).handler(
  async () => {
    const email = getCookie("pending-email");

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
    setCookie("pending-email", data, {
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      // TODO: update with env trigger
      // secure: true,            // enable in prod over HTTPS
    });

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
  // @ts-ignore
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

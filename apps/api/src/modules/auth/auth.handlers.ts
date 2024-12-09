import type { AppRouteHandler } from "@/types/index.types";
import type { RegisterRoute } from "./auth.routes";
import { registerUser } from "@novelty/services/auth.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import type { ServiceResponse } from "@novelty/services/types";
import { HttpStatusCodes } from "@/lib/http-status-codes";

export const handleRegister: AppRouteHandler<RegisterRoute> = async (c) => {
  const body = c.req.valid("json");

  const res: ServiceResponse = await registerUser(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    body,
  );

  if (res.error) {
    return c.json(
      {
        message:
          "The server is currently unable to handle the request. Please try again later.",
      },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  if (res.status === HttpStatusCodes.CONFLICT) {
    return c.json(
      {
        message: "An account with that email already exists.",
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  return c.json(
    {
      message:
        "Registration successful please verify your email to activate your account",
      user: res.body,
    },
    HttpStatusCodes.CREATED,
  );
};

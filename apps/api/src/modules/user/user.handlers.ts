import type { AppRouteHandler } from "@/types/index.types";
import type { GetProfileRoute } from "./user.routes";
import { getProfile } from "@novelty/services/user.service";
import { db } from "@novelty/db";
import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";

export const handleGetProfile: AppRouteHandler<GetProfileRoute> = async (c) => {
  const { userId } = c.var.user;

  const res = await getProfile<keyof GetProfileRoute["responses"]>(
    {
      dbInstance: db,
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    userId,
  );

  if (res.status === HttpStatusCodes.NOT_FOUND) {
    return c.json(
      {
        message: "Account does not exist",
        success: false,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(
    {
      userInfo: res.body,
    },
    HttpStatusCodes.OK,
  );
};

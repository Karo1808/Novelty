import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { getConnInfo } from "@hono/node-server/conninfo";

import env from "@/env";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import logger from "@/lib/logger";

const onError: ErrorHandler = (err, c) => {
  const currentStatus
    = "status" in err ? err.status : c.newResponse(null).status;
  const statusCode: StatusCode
    = currentStatus !== HttpStatusCodes.OK
      ? (currentStatus as StatusCode)
      : HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const nodeEnv = env.NODE_ENV ?? "development";

  const ipAddress = getConnInfo(c).remote.address;

  logger.error(
    {
      message: err.message,
      stack: nodeEnv === "production" ? undefined : err.stack,
      statusCode,
      method: c.req.method,
      url: c.req.url,
      query: c.req.query(),
      headers: c.req.header(),
      ipAddress,
    },
    "Error occurred during request processing",
  );

  return c.json(
    {
      message: err.message,
      stack: nodeEnv === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

export default onError;

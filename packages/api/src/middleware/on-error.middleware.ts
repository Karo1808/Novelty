import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import env from "@/env";
import { HttpStatusCodes } from "@/lib/http-status-codes";

const onError: ErrorHandler = (err, c) => {
  const currentStatus
    = "status" in err ? err.status : c.newResponse(null).status;
  const statusCode
    = currentStatus !== HttpStatusCodes.OK
      ? (currentStatus as StatusCode)
      : HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const nodeEnv = env.NODE_ENV ?? "development";

  return c.json(
    {
      message: err.message,

      stack: nodeEnv === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

export default onError;

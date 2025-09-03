import logger from "@/lib/logger";
import { prometheusRegistry } from "@/lib/metrics";
import { AppRouteHandler } from "@/types/index.types";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { basicSearch } from "@novelty/services/book.service";
import { BasicSearchRoute } from "./book.routes";

export const handleBasicBookSearch: AppRouteHandler<BasicSearchRoute> = async (
  c,
) => {
  const { query } = c.req.valid("query");

  const res = await basicSearch(
    {
      logger,
      prometheusRegistry,
      reqId: c.var.requestId,
    },
    query,
  );

  if (res.success === false) {
    return c.json(
      {
        success: false,
        message: res.error.message,
      },
      HttpStatusCodes[res.error.kind],
    );
  }

  return c.json(
    {
      success: true,
      data: res.data,
    },
    HttpStatusCodes.OK,
  );
};

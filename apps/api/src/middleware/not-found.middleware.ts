import type { NotFoundHandler } from "hono";

import { HttpStatusCodes } from "@novelty/lib/http-status-codes";

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${"Not found"} - ${c.req.path}`,
    },
    HttpStatusCodes.NOT_FOUND,
  );
};

export default notFound;

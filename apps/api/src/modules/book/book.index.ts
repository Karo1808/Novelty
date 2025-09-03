import { createRouter } from "@/lib/create-app";

import * as handlers from "./book.handlers";
import * as routes from "./book.routes";

export const bookRouter = createRouter().openapi(
  routes.basicSearchRoute,
  handlers.handleBasicBookSearch,
);

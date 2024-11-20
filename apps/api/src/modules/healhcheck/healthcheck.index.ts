import { createRouter } from "@/lib/create-app";

import * as handlers from "./healthcheck.handlers";
import * as routes from "./healthcheck.routes";

export const healthcheckRouter = createRouter().openapi(
  routes.healthcheckRoute,
  handlers.handleHealthcheck,
);

import { createRouter } from "@/lib/create-app";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

export const authRouter = createRouter()
  .openapi(routes.registerRoute, handlers.handleRegister)
  .openapi(
    routes.sendVerificationEmailRoute,
    handlers.handleSendVerificationEmail,
  );

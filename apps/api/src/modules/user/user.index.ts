import { createRouter } from "@/lib/create-app";
import * as routes from "./user.routes";
import * as handlers from "./user.handlers";

export const userRouter = createRouter()
  .openapi(routes.getProfileRoute, handlers.handleGetProfile)
  .openapi(routes.updateProfileRoute, handlers.handleUpdateProfile);

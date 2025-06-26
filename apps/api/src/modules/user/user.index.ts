import { createRouter } from "@/lib/create-app";
import * as handlers from "./user.handlers";
import * as routes from "./user.routes";

export const userRouter = createRouter()
  .openapi(routes.getUserRoute, handlers.handleGetUser)
  .openapi(routes.getProfileRoute, handlers.handleGetProfile)
  .openapi(routes.updateProfileRoute, handlers.handleUpdateProfile)
  .openapi(routes.getPreferencesRoute, handlers.handleGetPreferences)
  .openapi(routes.updatePreferencesRoute, handlers.handleUpdatePreferences)
  .openapi(routes.completeOnboardingRoute, handlers.handleCompleteOnboarding)
  .openapi(routes.getUserDraftRoute, handlers.handleGetUserDraft)
  .openapi(routes.updateUserDraftRoute, handlers.handleUpdateUserDraft);

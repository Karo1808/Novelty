import { healthcheckRouter } from "$/healhcheck/healthcheck.index";

import { startCronJobs } from "@/cron/scheduler";
import configureOpenAPI from "@/lib/configure-open-api";

import { configurePrometheus } from "@/lib/configure-prometheus";
import createApp from "@/lib/create-app";
import { authRouter } from "./modules/auth/auth.index";
import { userRouter } from "./modules/user/user.index";

startCronJobs();

const app = createApp()
  .route("/", healthcheckRouter)
  .route("/", authRouter)
  .route("/", userRouter);

configureOpenAPI(app);
configurePrometheus(app);

export type AppType = typeof app;

export default app;

import { healthcheckRouter } from "$/healhcheck/healthcheck.index";

import { startCronJobs } from "@/cron/scheduler";
import configureOpenAPI from "@/lib/configure-open-api";

import { configurePrometheus } from "@/lib/configure-prometheus";
import createApp from "@/lib/create-app";
import { authRouter } from "./modules/auth/auth.index";
import { bookRouter } from "./modules/book/book.index";
import { userRouter } from "./modules/user/user.index";

startCronJobs();

const app = createApp()
  .route("/", healthcheckRouter)
  .route("/", authRouter)
  .route("/", userRouter)
  .route("/", bookRouter);

configureOpenAPI(app);
configurePrometheus(app);

export type AppType = typeof app;

export default app;

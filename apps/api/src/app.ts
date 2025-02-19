import { healthcheckRouter } from "$/healhcheck/healthcheck.index";

import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";

import { configurePrometheus } from "@/lib/configure-prometheus";
import { startCronJobs } from "@/cron/scheduler";
import { authRouter } from "./modules/auth/auth.index";
import { userRouter } from "./modules/user/user.index";

const app = createApp();

startCronJobs();

configureOpenAPI(app);
configurePrometheus(app);

const routes = [healthcheckRouter, authRouter, userRouter];

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;

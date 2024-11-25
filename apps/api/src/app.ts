import { healthcheckRouter } from "$/healhcheck/healthcheck.index";

import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";

import { configurePrometheus } from "./lib/configure-prometheus";

const app = createApp();

configureOpenAPI(app);
configurePrometheus(app);

const routes = [healthcheckRouter];

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;

import { prometheus } from "@hono/prometheus";

import type { AppOpenAPI } from "@/types/index.types";

export const configurePrometheus = (app: AppOpenAPI) => {
  const { registerMetrics, printMetrics } = prometheus();

  app.use("*", registerMetrics);
  app.get("/metrics", printMetrics);
};

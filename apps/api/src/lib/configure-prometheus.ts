import type { AppOpenAPI } from "@/types/index.types";

import { prometheus } from "@hono/prometheus";

export const configurePrometheus = (app: AppOpenAPI) => {
  const { registerMetrics, printMetrics } = prometheus();

  app.use("*", registerMetrics);
  app.get("/metrics", printMetrics);
};

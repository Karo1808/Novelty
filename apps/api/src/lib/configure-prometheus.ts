import type { AppOpenAPI } from "@/types/index.types";

import { prometheus } from "@hono/prometheus";
import { prometheusRegistry } from "@/lib/metrics";

export const configurePrometheus = (app: AppOpenAPI) => {
  const { registerMetrics, printMetrics } = prometheus({
    registry: prometheusRegistry,
  });

  app.use("*", registerMetrics);
  app.get("/metrics", printMetrics);
};

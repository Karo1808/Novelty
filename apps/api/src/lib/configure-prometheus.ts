import type { AppOpenAPI } from "@/types/index.types";

import { prometheusRegistry } from "@/lib/metrics";
import { prometheus } from "@hono/prometheus";
import { emailQueue } from "@novelty/message-queue/queues/email.queue";

export const configurePrometheus = (app: AppOpenAPI) => {
  const { registerMetrics } = prometheus({
    registry: prometheusRegistry,
  });

  app.use("*", registerMetrics);
  app.get("/metrics", async () => {
    try {
      const bullMetrics = await emailQueue.exportPrometheusMetrics();
      const customMetrics = await prometheusRegistry.metrics();

      return new Response(`${bullMetrics}\n${customMetrics}`, {
        headers: { "Content-Type": "text/plain" },
      });
    }
    catch (error) {
      return new Response(
        `Error fetching metrics: ${(error as Error).message}`,
        {
          status: 500,
        },
      );
    }
  });
};

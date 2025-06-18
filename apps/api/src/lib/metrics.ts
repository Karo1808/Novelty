import { createMetric } from "@novelty/lib/factory/create-metric";
import { Registry } from "prom-client";

export const prometheusRegistry = new Registry();

export const cronJobOutcomeHistogram = (registry: Registry) => {
  return createMetric("Histogram", {
    name: "cron_job_outcome_duration_seconds",
    help: "Histogram for the duration and outcomes of cron jobs",
    labelNames: ["job_name", "outcome"],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    registry,
  });
};

export const rateLimitCounter = (registry: Registry) => {
  return createMetric("Counter", {
    name: "rate_limit_exceeded_total",
    help: "Total number of rate-limited requests",
    labelNames: ["path", "method"],
    registry,
  });
};

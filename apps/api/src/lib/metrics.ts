import { Histogram, Registry } from "prom-client";

export const prometheusRegistry = new Registry();

export const cronJobOutcomeHistogram = new Histogram({
  name: "cron_job_outcome_duration_seconds",
  help: "Histogram for the duration and outcomes of cron jobs",
  labelNames: ["job_name", "outcome"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [prometheusRegistry],
});

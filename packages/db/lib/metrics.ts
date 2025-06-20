import type { Registry } from "prom-client";
import { createMetric } from "@novelty/lib/factory/create-metric";

export const dbQueryDurationHistogram = (registry: Registry) => {
  return createMetric("Histogram", {
    name: "db_query_duration_ms",
    help: "Duration of database queries in milliseconds",
    labelNames: ["queryName", "status"],
    buckets: [1, 10, 50, 100, 200, 500, 1000, 2000, 3000, 5000],
    registry,
  });
};

import { createMetric } from "@novelty/lib/factory/create-metric";
import { Registry } from "prom-client";

export const apiQueryDurationHistogram = (registry: Registry) => {
  return createMetric("Histogram", {
    name: "external_api_query_duration_ms",
    help: "Duration of external api query in milliseconds",
    labelNames: ["queryName", "status"],
    buckets: [1, 10, 50, 100, 200, 500, 1000, 2000, 3000, 5000],
    registry,
  });
};

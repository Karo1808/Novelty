import { afterEach, describe, expect, it, vi } from "vitest";
import { Registry } from "prom-client";

vi.mock("@novelty/lib/factory/create-metric", () => ({
  createMetric: vi.fn(),
}));

const { createMetric } = await import("@novelty/lib/factory/create-metric");
const { cronJobOutcomeHistogram, rateLimitCounter } = await import("../metrics");

describe("metrics helpers", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates histogram metric with correct configuration", () => {
    const registry = new Registry();
    cronJobOutcomeHistogram(registry);

    expect(createMetric).toHaveBeenCalledWith("Histogram", {
      name: "cron_job_outcome_duration_seconds",
      help: "Histogram for the duration and outcomes of cron jobs",
      labelNames: ["job_name", "outcome"],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registry,
    });
  });

  it("creates rate limit counter metric with correct configuration", () => {
    const registry = new Registry();
    rateLimitCounter(registry);

    expect(createMetric).toHaveBeenCalledWith("Counter", {
      name: "rate_limit_exceeded_total",
      help: "Total number of rate-limited requests",
      labelNames: ["path", "method"],
      registry,
    });
  });
});

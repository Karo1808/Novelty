import type {
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  Metric,
  Registry,
  SummaryConfiguration,
} from "prom-client";
import { Counter, Gauge, Histogram, Summary } from "prom-client";

export function createMetric(
  type: "Histogram",
  options: HistogramConfiguration<string> & { registry: Registry },
): Histogram<string>;
export function createMetric(
  type: "Counter",
  options: CounterConfiguration<string> & { registry: Registry },
): Counter<string>;
export function createMetric(
  type: "Gauge",
  options: GaugeConfiguration<string> & { registry: Registry },
): Gauge<string>;
export function createMetric(
  type: "Summary",
  options: SummaryConfiguration<string> & { registry: Registry },
): Summary<string>;

export function createMetric(
  type: "Histogram" | "Counter" | "Gauge" | "Summary",
  options: any,
): any {
  const { name, registry } = options;

  const existingMetric = registry.getSingleMetric(name) as
    | Metric<string>
    | undefined;
  if (existingMetric) {
    return existingMetric;
  }

  options.registers = [registry];

  switch (type) {
    case "Histogram":
      return new Histogram(options);
    case "Counter":
      return new Counter(options);
    case "Gauge":
      return new Gauge(options);
    case "Summary":
      return new Summary(options);
    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
}

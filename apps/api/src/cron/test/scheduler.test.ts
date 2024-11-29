import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";
import cron from "node-cron";
import * as Sentry from "@sentry/node";
import { startCronJobs } from "@/cron/scheduler";
import logger from "@/lib/logger";
import { callHealthcheck } from "@/cron/jobs/status.job";

vi.mock("node-cron", () => ({
  default: {
    schedule: vi.fn(),
  },
}));
vi.mock("@sentry/node", () => ({
  cron: {
    instrumentNodeCron: vi.fn(cronInstance => cronInstance),
  },
  captureCheckIn: vi.fn(),
}));
vi.mock("@/lib/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("../jobs/status.job", () => ({
  callHealthcheck: vi.fn(),
}));

describe("startCronJobs", () => {
  it("should schedule the healthcheck job with the correct configuration", () => {
    startCronJobs();

    expect(Sentry.cron.instrumentNodeCron).toHaveBeenCalledWith(cron);
    expect(logger.info).toHaveBeenCalledWith("Cron jobs started!");
    expect(cron.schedule).toHaveBeenCalledWith(
      "0 * * * *",
      expect.any(Function),
      { name: "healthcheck-cron", timezone: "UTC" },
    );
  });

  it("should execute the healthcheck job on schedule", async () => {
    const scheduledFunction = (cron.schedule as Mock).mock.calls?.[0]?.[1];

    await scheduledFunction();

    expect(logger.info).toHaveBeenCalledWith({
      message: "Executing Hourly Healhtcheck Cron Job...",
    });
    expect(callHealthcheck).toHaveBeenCalled();
  });
});

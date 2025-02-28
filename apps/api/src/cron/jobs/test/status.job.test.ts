import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callHealthcheck } from "../status.job";
import * as Sentry from "@sentry/node";
import logger from "@/lib/logger";
import env from "@/env";
import type { HealthcheckOKResponse } from "$/healhcheck/healthcheck.validations";

vi.mock("@sentry/node", () => ({
  captureCheckIn: vi.fn(),
}));
vi.mock("node-fetch", () => ({
  default: vi.fn(),
}));
vi.mock("@/lib/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

let dbClient: any;

vi.mock("@novelty/db/index", () => ({
  get db() {
    return dbClient;
  },
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("callHealthcheck", () => {
  const mockMonitorSlug = "healthcheck-cron";
  const mockCheckInId = "mock-checkin-id";

  beforeEach(async () => {
    vi.clearAllMocks();
    (Sentry.captureCheckIn as Mock).mockReturnValue(mockCheckInId);
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  it("should call the healthcheck endpoint and mark it as successful", async () => {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve<HealthcheckOKResponse>({
            status: "healthy",
            environment: "test",
            readiness: {
              database: "connected",
              redis: "connected",
              emailQueue: "connected",
              r2: "connected",
            },
          }),
      }),
    );

    await callHealthcheck();

    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      monitorSlug: mockMonitorSlug,
      status: "in_progress",
    });
    expect(fetch).toHaveBeenCalledOnce();
    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      checkInId: mockCheckInId,
      monitorSlug: mockMonitorSlug,
      status: "ok",
    });
    expect(logger.info).toHaveBeenCalled();
  });

  it("should log an error and mark it as failed when the healthcheck fails", async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await callHealthcheck();

    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      monitorSlug: mockMonitorSlug,
      status: "in_progress",
    });
    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      checkInId: mockCheckInId,
      monitorSlug: mockMonitorSlug,
      status: "error",
    });
    expect(logger.error).toHaveBeenCalled();
  });

  it("should log an error and mark it as failed when an exception occurs", async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error("Network Error"));

    await callHealthcheck();

    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      monitorSlug: mockMonitorSlug,
      status: "in_progress",
    });
    expect(Sentry.captureCheckIn).toHaveBeenCalledWith({
      checkInId: mockCheckInId,
      monitorSlug: mockMonitorSlug,
      status: "error",
    });
    expect(logger.error).toHaveBeenCalled();
  });
});

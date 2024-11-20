import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { getUptime } from "../get-uptime";

describe("getUptime", () => {
  let mockNow: number;

  beforeAll(() => {
    mockNow = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(mockNow);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the correct uptime string for a given start time", () => {
    const startTime
      = mockNow - (1 * 60 * 60 * 1000 + 20 * 60 * 1000 + 30 * 1000);

    const result = getUptime(startTime);

    expect(result).toBe("1 hours 20 minutes 30 seconds");
  });

  it("should return '0 hours 0 minutes 0 seconds' for the same start time as current time", () => {
    const startTime = mockNow;

    const result = getUptime(startTime);

    expect(result).toBe("0 hours 0 minutes 0 seconds");
  });
});

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { getIsosTime } from "../get-isos-time";

describe("getIsosTime", () => {
  let mockNow: number;

  beforeAll(() => {
    mockNow = Date.UTC(2024, 10, 20, 12, 34, 56);
    vi.spyOn(Date, "now").mockReturnValue(mockNow);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the correct ISO string for the current time", () => {
    const result = getIsosTime();

    expect(result).toBe("2024-11-20T12:34:56.000Z");
  });

  it("should always return a string in ISO 8601 format", () => {
    const result = getIsosTime();

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

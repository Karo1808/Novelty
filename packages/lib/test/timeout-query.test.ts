import { describe, expect, it, vi } from "vitest";
import { timeoutQuery } from "../timeout-query";
import type { Logger } from "../types";
import "dotenv/config";

// eslint-disable-next-line node/no-process-env
if (process.env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("timeoutQuery", () => {
  it("resolves the query if it completes within the timeout", async () => {
    const mockQuery = new Promise(resolve =>
      setTimeout(() => resolve("success"), 100),
    );

    const result = await timeoutQuery({
      query: mockQuery,
      timeoutDuration: 200,
      customError: new Error("Test"),
      logger: undefined,
      queryName: "resolve-query",
    });

    expect(result).toBe("success");
  });

  it("rejects with the custom error if the query exceeds the timeout duration", async () => {
    const mockQuery = new Promise(resolve =>
      setTimeout(() => resolve("success"), 300),
    );

    const customError = new Error("Test");

    await expect(
      timeoutQuery({
        query: mockQuery,
        timeoutDuration: 200,
        customError,
        logger: undefined,
        queryName: "timeout-query",
      }),
    ).rejects.toThrow(customError);
  });

  it("propagates the query error if the query fails before the timeout", async () => {
    const mockQuery = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("query error")), 100),
    );

    const customError = new Error("Test");

    await expect(
      timeoutQuery({
        query: mockQuery,
        timeoutDuration: 200,
        customError,
        logger: undefined,
        queryName: "propagate-query-error",
      }),
    ).rejects.toThrow("query error");
  });

  it("logs a warning when the timeout is triggered", async () => {
    const mockQuery = new Promise(resolve =>
      setTimeout(() => resolve("success"), 300),
    );

    const mockLogger = {
      warn: vi.fn(),
    } as unknown as Logger;

    const customError = new Error("Test");

    await expect(
      timeoutQuery({
        query: mockQuery,
        timeoutDuration: 200,
        customError,
        logger: mockLogger,
        queryName: "log-warning",
      }),
    ).rejects.toThrow(customError);

    expect(mockLogger.warn).toHaveBeenCalledWith({
      message: "Query timed out",
      queryName: "log-warning",
      timeoutDuration: 200,
      error: customError,
    });
  });
});

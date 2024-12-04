import { describe, expect, it, vi } from "vitest";
import { timeoutQuery } from "../timeout-query";
import { QueryTimeoutError } from "../errors";
import type { Logger } from "@novelty/lib/types";
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
    const result = await timeoutQuery(mockQuery, 200);
    expect(result).toBe("success");
  });

  it("rejects with QueryTimeoutError if the query exceeds the timeout duration", async () => {
    const mockQuery = new Promise(resolve =>
      setTimeout(() => resolve("success"), 300),
    );
    await expect(timeoutQuery(mockQuery, 200)).rejects.toThrow(
      QueryTimeoutError,
    );
  });

  it("propagates the query error if the query fails before the timeout", async () => {
    const mockQuery = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("query error")), 100),
    );
    await expect(timeoutQuery(mockQuery, 200)).rejects.toThrow("query error");
  });

  it("logs a warning when the timeout is triggered", async () => {
    const mockQuery = new Promise(resolve =>
      setTimeout(() => resolve("success"), 300),
    );

    const mockLogger = {
      warn: vi.fn(),
    } as unknown as Logger;

    await expect(
      timeoutQuery(mockQuery, 200, mockLogger, "test-query"),
    ).rejects.toThrow(QueryTimeoutError);

    expect(mockLogger.warn).toHaveBeenCalledWith({
      message: "Query timed out",
      queryName: "test-query",
      timeoutDuration: 200,
    });
  });
});

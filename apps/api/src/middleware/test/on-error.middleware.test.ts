import type { Context } from "hono";

import { describe, expect, it, vi } from "vitest";

import { HttpStatusCodes } from "@/lib/http-status-codes";
import onError from "@/middleware/on-error.middleware";

vi.mock("@/env", () => ({
  default: { NODE_ENV: "development" },
}));

describe("onError middleware", () => {
  it("should return correct error response in development mode", async () => {
    const err = new Error("Test error");
    const c = {
      json: vi.fn().mockReturnValue("mockResponse"),
      newResponse: () => ({ status: 500 }),
    } as unknown as Context;

    const response = onError(err, c);

    expect(c.json).toHaveBeenCalledWith(
      { message: "Test error", stack: err.stack },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
    expect(response).toBe("mockResponse");
  });

  it("should use the status code from the error if available", async () => {
    const err = new Error("Specific error") as Error & { status: number };
    err.status = HttpStatusCodes.NOT_FOUND;

    const c = {
      json: vi.fn().mockReturnValue("mockResponse"),
      newResponse: () => ({ status: 500 }),
    } as unknown as Context;

    const response = onError(err, c);

    expect(c.json).toHaveBeenCalledWith(
      { message: "Specific error", stack: err.stack },
      HttpStatusCodes.NOT_FOUND,
    );
    expect(response).toBe("mockResponse");
  });
});

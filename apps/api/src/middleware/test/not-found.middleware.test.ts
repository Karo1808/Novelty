import type { Context } from "hono";

import notFound from "@/middleware/not-found.middleware";

import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import { describe, expect, it, vi } from "vitest";

describe("notFound handler", () => {
  it("should return a 404 response with the correct message", () => {
    const c = {
      json: vi.fn().mockReturnValue("mockResponse"),
      req: { path: "/non-existent-route" },
    } as unknown as Context;

    const response = notFound(c);

    expect(c.json).toHaveBeenCalledWith(
      { message: "Not found - /non-existent-route" },
      HttpStatusCodes.NOT_FOUND,
    );

    expect(response).toBe("mockResponse");
  });
});

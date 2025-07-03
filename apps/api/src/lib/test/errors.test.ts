import { describe, expect, it } from "vitest";
import { DatabaseConnectionError } from "../errors";

describe("DatabaseConnectionError", () => {
  it("sets name and stores original error", () => {
    const original = new Error("boom");
    const err = new DatabaseConnectionError("msg", original);

    expect(err.name).toBe("DatabaseConnectionError");
    expect(err.originalError).toBe(original);
    expect(err.message).toBe("msg");
  });
});

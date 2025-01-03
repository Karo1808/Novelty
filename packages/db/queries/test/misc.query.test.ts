import { describe, expect, it } from "vitest";
import { getStatusQuery } from "../misc.query";

import "dotenv/config";
import { testDependencies } from "test-setup";

describe("getStatusQuery", () => {
  it("executes the SELECT 1 query successfully", async () => {
    const result = await getStatusQuery(testDependencies);
    expect(result).toBeTruthy();
  });
});

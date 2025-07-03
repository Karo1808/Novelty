import { describe, expect, it } from "vitest";
import packageJSON from "../../package.json" with { type: "json" };

const { getOpenApiDefinition } = await import("../get-open-api-doc");

describe("getOpenApiDefinition", () => {
  it("returns definition with package version", () => {
    const doc = getOpenApiDefinition();
    expect(doc.openapi).toBe("3.0.0");
    expect(doc.info.version).toBe(packageJSON.version);
    expect(doc.info.title).toBe("Novelty API");
  });
});

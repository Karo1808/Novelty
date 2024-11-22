import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

import env from "@/env";
import createApp from "@/lib/create-app";
import { HttpStatusCodes } from "@/lib/http-status-codes";

import { healthcheckRouter } from "../healthcheck.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", healthcheckRouter));

describe("healthcheck routes", () => {
  it("get /healthcheck return success", async () => {
    const response = await client.healthcheck.$get();

    expect(response.status).toBe(HttpStatusCodes.OK);

    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expect(json.status).toMatch(/healthy/i);
      expect(json.environment).toBe("test");
    }
  });
});

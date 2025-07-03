import { describe, expect, it, vi } from "vitest";
import env from "@/env";

vi.mock("@hono/sentry", () => ({
  sentry: vi.fn(() => vi.fn()),
}));
vi.mock("@/middleware/sentry-configure-scope.middleware", () => ({
  sentryConfigureScope: vi.fn(() => vi.fn()),
}));
vi.mock("@/middleware/request-logger.middleware", () => ({
  requestLogger: vi.fn(() => vi.fn()),
}));
vi.mock("@/middleware/sentry-transaction.middleware", () => ({
  sentryTransactionMiddleware: vi.fn(() => vi.fn()),
}));

const { sentry } = await import("@hono/sentry");
const { sentryConfigureScope } = await import("@/middleware/sentry-configure-scope.middleware");
const { sentryTransactionMiddleware } = await import("@/middleware/sentry-transaction.middleware");

const { default: createApp, createTestApp } = await import("../create-app");
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";

describe("createApp", () => {
  it("includes Sentry middleware when not in test environment", () => {
    env.NODE_ENV = "development";
    createApp();

    expect(sentry).toHaveBeenCalledWith({ dsn: env.SENTRY_DSN });
    expect(sentryConfigureScope).toHaveBeenCalled();
    expect(sentryTransactionMiddleware).toHaveBeenCalled();
  });

  it("createTestApp routes provided router", async () => {
    const router = new OpenAPIHono();
    router.get("/hello", c => c.text("hi"));

    const app = createTestApp(router);
    const client = testClient(app);
    const res = await client.request("/hello");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("hi");
  });
});

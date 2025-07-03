import { describe, expect, it, vi } from "vitest";
import env from "@/env";

vi.mock("@hono/node-server/conninfo", () => ({
  getConnInfo: vi.fn(() => ({
    remote: { address: "127.0.0.1" },
  })),
}));

const next = vi.fn();
const sentryMock = {
  setTag: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
  setContext: vi.fn(),
};

const { sentryConfigureScope } = await import("../sentry-configure-scope.middleware");

describe("sentryConfigureScope", () => {
  it("configures Sentry scope with request details", async () => {
    env.NODE_ENV = "development";
    const c: any = {
      get: () => sentryMock,
      var: { requestId: "req-1" },
      req: {
        method: "GET",
        url: "/test",
        header: () => ({ "x-user-id": "123", "x-user-email": "u@test.com" }),
      },
    };

    await sentryConfigureScope()(c, next);

  expect(sentryMock.setTag).toHaveBeenCalledWith("serverEnvironment", "development");
  expect(sentryMock.setTag).toHaveBeenCalledWith("requestId", "req-1");
  expect(sentryMock.setUser).toHaveBeenCalledWith({ id: "123", email: "u@test.com" });
  expect(sentryMock.addBreadcrumb).toHaveBeenCalledWith({
    category: "request",
    message: "User 123 accessed /test",
    level: "info",
  });
  expect(sentryMock.setContext).toHaveBeenCalledWith("request", {
    method: "GET",
    url: "/test",
    headers: { "x-user-id": "123", "x-user-email": "u@test.com" },
    ip: "127.0.0.1",
  });
  expect(next).toHaveBeenCalled();
  });

  it("skips when sentry hub is missing", async () => {
    next.mockClear();
    const c: any = { get: () => undefined };
    await sentryConfigureScope()(c, next);
    expect(next).not.toHaveBeenCalled();
  });
});

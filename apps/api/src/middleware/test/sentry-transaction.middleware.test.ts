import { describe, expect, it, vi } from "vitest";

const mockSpan = {
  end: vi.fn(),
  setStatus: vi.fn(),
  setAttribute: vi.fn(),
};

vi.mock("@sentry/node", () => ({
  startSpan: vi.fn((opts, cb) => cb(mockSpan)),
  captureException: vi.fn(),
}));

const Sentry = await import("@sentry/node");
const { sentryTransactionMiddleware } = await import("../sentry-transaction.middleware");

const next = vi.fn();

describe("sentryTransactionMiddleware", () => {
  it("stores span and ends it", async () => {
    const c: any = { req: { method: "GET", url: "/" }, set: vi.fn() };
    await sentryTransactionMiddleware()(c, next);

    expect(c.set).toHaveBeenCalledWith("sentrySpan", mockSpan);
    expect(mockSpan.end).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("captures exception when set fails", async () => {
    const error = new Error("fail");
    const c: any = { req: { method: "GET", url: "/" }, set: vi.fn(() => { throw error; }) };

    await expect(sentryTransactionMiddleware()(c, next)).rejects.toThrow(error);

    expect(mockSpan.setStatus).toHaveBeenCalledWith({ code: 2 });
    expect(mockSpan.setAttribute).toHaveBeenCalledWith("error.message", error.message);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
    expect(mockSpan.end).toHaveBeenCalled();
  });
});

import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authMiddleware } from "../auth.middleware";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import * as sessionService from "@novelty/services/session.service";
import type { AppBindings, User } from "@/types/index.types";

describe("authMiddleware", () => {
  let app: Hono<AppBindings>;

  beforeEach(() => {
    app = new Hono<AppBindings>();

    app.use("/protected/*", authMiddleware());

    app.get("/protected/test", (c) => {
      const user = c.var.user;
      return c.json({ message: "Authorized", user });
    });
  });

  it("should return 401 Unauthorized if no session cookie is provided", async () => {
    const req = new Request("http://localhost/protected/test");
    const res = await app.request(req);
    expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe("Unauthorized");
  });

  it("should return 401 Unauthorized if session is invalid", async () => {
    const validateSpy = vi
      .spyOn(sessionService, "validateSessionToken")
      .mockResolvedValue(null);

    const req = new Request("http://localhost/protected/test");
    req.headers.set("Cookie", "session=invalid-token");
    const res = await app.request(req);
    expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe("Unauthorized");
    validateSpy.mockRestore();
  });

  it("should call next and set user if session is valid", async () => {
    const fakeSession: sessionService.Session = {
      id: "session-id",
      userId: "user-id",
      expiresAt: new Date(Date.now() + 10000),
    };

    const validateSpy = vi
      .spyOn(sessionService, "validateSessionToken")
      .mockResolvedValue(fakeSession);

    const req = new Request("http://localhost/protected/test");
    req.headers.set("Cookie", "session=valid-token");
    const res = await app.request(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      message: string;
      user: User;
    };
    expect(body.message).toBe("Authorized");
    expect(body.user).toEqual({
      userId: fakeSession.userId,
      sessionId: fakeSession.id,
    });
    validateSpy.mockRestore();
  });
});

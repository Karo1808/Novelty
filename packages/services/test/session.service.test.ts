import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
  invalidateSession,
  SESSION_EXPIRATION_TIME,
  SESSION_RENEWAL_TIME,
  validateSessionToken,
} from "../session.service";
import { testDependencies, testRedis } from "../test-setup";

const toUnixSeconds = (date: Date): number => Math.floor(date.getTime() / 1000);

describe("session management", () => {
  beforeEach(async () => {
    await testRedis.flushall();
  });

  afterEach(async () => {
    await testRedis.flushall();
  });

  describe("generateSessionToken", () => {
    it("should return a non-empty string", () => {
      const token = generateSessionToken();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should produce different tokens on subsequent calls", () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("createSession", () => {
    it("should create a session, store it in Redis, and add it to user sessions set", async () => {
      const dummyToken = "dummy-token-create";
      const userId = "user-123";
      const session = await createSession(testDependencies, dummyToken, userId);

      expect(session).toHaveProperty("id");
      expect(session.userId).toBe(userId);
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());

      const sessionKey = `session:${session.id}`;
      const storedValue = await testRedis.get(sessionKey);
      expect(storedValue).toBeTruthy();
      const parsed = JSON.parse(storedValue!);
      expect(parsed.id).toBe(session.id);
      expect(parsed.user_id).toBe(userId);

      const userSessionsKey = `user_sessions:${userId}`;
      const setMembers = await testRedis.smembers(userSessionsKey);
      expect(setMembers).toContain(session.id);
    });
  });

  describe("validateSessionToken", () => {
    const dummyToken = "dummy-token-validate";
    const userId = "user-123";
    let sessionId: string;

    beforeEach(async () => {
      const session = await createSession(testDependencies, dummyToken, userId);
      sessionId = session.id;
    });

    it("should return the session if it is valid", async () => {
      const session = await validateSessionToken(testDependencies, dummyToken);
      expect(session).not.toBeNull();
      expect(session?.id).toBe(sessionId);
      expect(session?.userId).toBe(userId);
    });

    it("should return null and delete the session if it has expired", async () => {
      const sessionKey = `session:${sessionId}`;
      const expiredTimestamp = toUnixSeconds(new Date(Date.now() - 1000)); // expired 1 sec ago
      const expiredValue = JSON.stringify({
        id: sessionId,
        user_id: userId,
        expires_at: expiredTimestamp,
      });
      await testRedis.set(sessionKey, expiredValue);

      const session = await validateSessionToken(testDependencies, dummyToken);
      expect(session).toBeNull();

      const storedAfter = await testRedis.get(sessionKey);
      expect(storedAfter).toBeNull();
    });

    it("should renew the session if it is within the renewal time", async () => {
      const sessionKey = `session:${sessionId}`;
      const nearExpiry = Date.now() + SESSION_RENEWAL_TIME - 1000;
      const nearExpiryUnix = toUnixSeconds(new Date(nearExpiry));
      const nearExpiryValue = JSON.stringify({
        id: sessionId,
        user_id: userId,
        expires_at: nearExpiryUnix,
      });
      await testRedis.set(sessionKey, nearExpiryValue);

      const session = await validateSessionToken(testDependencies, dummyToken);
      expect(session).not.toBeNull();
      expect(session!.expiresAt.getTime()).toBeGreaterThanOrEqual(
        Date.now() + SESSION_EXPIRATION_TIME - 1000,
      );
    });
  });

  describe("invalidateSession", () => {
    it("should delete the session key and remove it from the user's sessions set", async () => {
      const dummyToken = "dummy-token-invalidate";
      const userId = "user-123";
      const session = await createSession(testDependencies, dummyToken, userId);
      const sessionKey = `session:${session.id}`;
      const userSessionsKey = `user_sessions:${userId}`;

      expect(await testRedis.get(sessionKey)).toBeTruthy();
      let setMembers = await testRedis.smembers(userSessionsKey);
      expect(setMembers).toContain(session.id);

      await invalidateSession(testDependencies, session.id, userId);

      expect(await testRedis.get(sessionKey)).toBeNull();
      setMembers = await testRedis.smembers(userSessionsKey);
      expect(setMembers).not.toContain(session.id);
    });
  });

  describe("invalidateAllSessions", () => {
    it("should remove all sessions for a given user", async () => {
      const userId = "user-123";
      const session1 = await createSession(testDependencies, "token-1", userId);
      const session2 = await createSession(testDependencies, "token-2", userId);
      const userSessionsKey = `user_sessions:${userId}`;

      const setMembers = await testRedis.smembers(userSessionsKey);
      expect(setMembers).toContain(session1.id);
      expect(setMembers).toContain(session2.id);

      expect(await testRedis.get(`session:${session1.id}`)).toBeTruthy();
      expect(await testRedis.get(`session:${session2.id}`)).toBeTruthy();

      await invalidateAllSessions(testDependencies, userId);

      expect(await testRedis.get(userSessionsKey)).toBeNull();
      expect(await testRedis.get(`session:${session1.id}`)).toBeNull();
      expect(await testRedis.get(`session:${session2.id}`)).toBeNull();
    });

    it("should do nothing if no sessions exist for the user", async () => {
      const userId = "non-existent-user";
      await testRedis.del(`user_sessions:${userId}`);
      await invalidateAllSessions(testDependencies, userId);
      const keys = await testRedis.keys("*");
      expect(keys).toHaveLength(0);
    });
  });
});

import type { MarkKeysAsPartial } from "@novelty/lib/types";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { ServiceDependencies } from "./types";
import { prepareDependencies } from "./lib/utils";
import {
  addToSet,
  deleteByKey,
  getByKey,
  getSetMembers,
  removeFromSet,
  setWithExpiry,
} from "@novelty/redis/queries/index.query";

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export const SESSION_RENEWAL_TIME = 1000 * 60 * 60 * 24 * 15; // 15 days

export const generateSessionToken = (): string => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
};

export const createSession = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "messageQueueInstance"]
  >,
  token: string,
  userId: string,
) => {
  const deps = prepareDependencies(dependencies, "dbInstance");

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_EXPIRATION_TIME),
  };

  const key = `session:${session.id}`;
  const expiresAt = Math.floor(Number(session.expiresAt) / 1000);
  const value = JSON.stringify({
    id: session.id,
    user_id: session.userId,
    expires_at: new Date(expiresAt),
  });

  await setWithExpiry(deps, key, value, expiresAt);

  await addToSet(deps, `user_sessions:${userId}`, sessionId);

  return session;
};

export const validateSessionToken = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "messageQueueInstance"]
  >,
  token: string,
): Promise<Session | null> => {
  const deps = prepareDependencies(dependencies, "dbInstance");

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const key = `session:${sessionId}`;

  const item = await getByKey(deps, key);
  if (item === null) {
    return null;
  }
  const result = JSON.parse(item);

  const session: Session = {
    id: result.id,
    userId: result.user_id,
    expiresAt: new Date(result.expires_at * 1000),
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteByKey(deps, key);
    await removeFromSet(deps, key, sessionId);
    return null;
  }

  if (Date.now() >= session.expiresAt.getTime() - SESSION_RENEWAL_TIME) {
    session.expiresAt = new Date(Date.now() + SESSION_EXPIRATION_TIME);

    const expiresAt = Math.floor(Number(session.expiresAt) / 1000);
    const value = JSON.stringify({
      id: session.id,
      user_id: session.userId,
      expires_at: new Date(expiresAt),
    });

    await setWithExpiry(deps, key, value, expiresAt);
  }

  return session;
};

export const invalidateSession = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "messageQueueInstance"]
  >,
  sessionId: string,
  userId: string,
): Promise<void> => {
  const deps = prepareDependencies(dependencies, "dbInstance");

  await deleteByKey(deps, `session:${sessionId}`);
  await removeFromSet(deps, `user_sessions:${userId}`, sessionId);
};

export const invalidateAllSessions = async (
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["dbInstance", "messageQueueInstance"]
  >,
  userId: string,
): Promise<void> => {
  const deps = prepareDependencies(dependencies, "dbInstance");

  const sessionIds = await getSetMembers(deps, `user_sessions:${userId}`);
  if (sessionIds.length < 1) {
    return;
  }

  const pipeline = deps.redisClient.pipeline();

  for (const sessionId of sessionIds) {
    pipeline.unlink(`session:${sessionId}`);
  }
  pipeline.unlink(`user_sessions:${userId}`);

  await pipeline.exec();
};

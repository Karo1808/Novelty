/* eslint-disable node/prefer-global/buffer */
import crypto, { timingSafeEqual } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import "dotenv/config";

export async function hashString(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyHash(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await verify(hashedPassword, password);
}

export function encryptString(plainText: string): string {
  // eslint-disable-next-line node/no-process-env
  const encryptionKey = process.env.ENCRYPTION_KEY!;
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "utf8"),
    iv,
  );

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

export function decryptString(encryptedInput: string): string {
  // eslint-disable-next-line node/no-process-env
  const encryptionKey = process.env.ENCRYPTION_KEY!;

  const parts = encryptedInput.split(":");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid encrypted input format. Expected iv:encrypted:authTag.",
    );
  }
  const [ivHex, encryptedData, authTagHex] = parts;

  if (!ivHex || !encryptedData || !authTagHex) {
    throw new Error("Invalid encrypted input format. Missing parts.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "utf8"),
    iv,
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export const encodeToken = (token: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export function constantTimeCompare(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a, "utf8");
    const bBuf = Buffer.from(b, "utf8");
    return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
  }
  catch {
    return false;
  }
}
export function generatePasswordResetToken(): {
  hashedToken: string;
  rawToken: string;
} {
  const randomBytes = crypto.randomBytes(32);

  const rawToken = randomBytes.toString("hex");

  const hashedToken = encodeToken(rawToken);

  return {
    hashedToken,
    rawToken,
  };
}

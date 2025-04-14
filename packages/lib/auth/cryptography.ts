/* eslint-disable node/prefer-global/buffer */
import { hash, verify } from "@node-rs/argon2";
import crypto, { timingSafeEqual } from "node:crypto";
import "dotenv/config";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

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

export function encryptString(input: string): string {
  const iv = crypto.randomBytes(16);
  // eslint-disable-next-line node/no-process-env
  const encryptionKey = process.env.ENCRYPTION_KEY!;

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "utf8"),
    iv,
  );

  let encrypted = cipher.update(input, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptString(encryptedInput: string): string {
  // eslint-disable-next-line node/no-process-env
  const encryptionKey = process.env.ENCRYPTION_KEY!;

  const [ivHex, encryptedData] = encryptedInput.split(":");
  if (!ivHex || !encryptedData) {
    throw new Error("Invalid encrypted input format.");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "utf8"),
    iv,
  );

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

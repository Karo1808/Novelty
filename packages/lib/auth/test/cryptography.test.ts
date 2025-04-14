import { describe, expect, it } from "vitest";
import { decryptString, encryptString, hashString } from "../cryptography";

// eslint-disable-next-line node/no-process-env
process.env.ENCRYPTION_KEY = "12345678901234567890123456789012";

describe("cryptography", () => {
  describe("hashPassword", () => {
    it("should return a hash that is different from the original password", async () => {
      const password = "mysecretpassword";
      const hashed = await hashString(password);
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });

    it("should produce different hashes for the same password (due to salting)", async () => {
      const password = "mysecretpassword";
      const hash1 = await hashString(password);
      const hash2 = await hashString(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("encryptString", () => {
    it("should encrypt a string and return an output in the format iv:encryptedData", () => {
      const input = "Test message";
      const encrypted = encryptString(input);
      expect(encrypted).toContain(":");
      const [iv, data] = encrypted.split(":");
      expect(iv).toHaveLength(32);
      expect(data!.length).toBeGreaterThan(0);
    });
  });

  describe("decryptString", () => {
    it("should decrypt an encrypted string back to the original", () => {
      const original = "Hello, cryptography!";
      const encrypted = encryptString(original);
      const decrypted = decryptString(encrypted);
      expect(decrypted).toBe(original);
    });

    it("should throw an error if the encrypted input format is invalid", () => {
      expect(() => decryptString("invalidinput")).toThrow(
        "Invalid encrypted input format.",
      );
    });
  });
});

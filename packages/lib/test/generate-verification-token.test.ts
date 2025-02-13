import { describe, expect, it } from "vitest";
import { generateVerificationToken } from "../generate-verification-token"; // Adjust the path if needed

describe("generateVerificationToken", () => {
  it("should return a string", () => {
    const token = generateVerificationToken(4);

    expect(typeof token).toBe("string");
  });

  it("should return a token with the specified number of digits", () => {
    const length = 6;

    const token = generateVerificationToken(length);

    expect(token).toHaveLength(length);
  });

  it("should return a token that contains only numeric digits", () => {
    const token = generateVerificationToken(8);

    expect(/^\d+$/.test(token)).toBe(true);
  });

  it("should produce different tokens on subsequent calls", () => {
    const token1 = generateVerificationToken(6);
    const token2 = generateVerificationToken(6);

    expect(token1).not.toEqual(token2);
  });

  it("should throw an error for non-positive length", () => {
    expect(() => generateVerificationToken(0)).toThrow();
    expect(() => generateVerificationToken(-5)).toThrow();
  });
});

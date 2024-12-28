import { randomInt } from "node:crypto";

export function generateVerificationToken(length = 0): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return randomInt(min, max).toString();
}

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

/** Passwords are stored as `scrypt$N$r$p$salt$hash`, never in plaintext. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, KEY_LENGTH) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, expected] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expected) return false;

  const actual = await scrypt(password, salt, KEY_LENGTH) as Buffer;
  const expectedBuffer = Buffer.from(expected, "hex");
  return expectedBuffer.length === actual.length && timingSafeEqual(expectedBuffer, actual);
}

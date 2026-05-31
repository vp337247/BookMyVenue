import { pbkdf2Sync, timingSafeEqual, randomBytes } from 'crypto';

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export function genRandomBytes(length: number): string {
  return randomBytes(length).toString('hex');
}

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = genRandomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return { salt, hash };
}

export function verifyPassword(options: { password: string; salt: string; hash: string }): boolean {
  const computedHash = pbkdf2Sync(options.password, options.salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return timingSafeEqual(Buffer.from(options.hash, 'hex'), Buffer.from(computedHash, 'hex'));
}

export function generateRandomPassword(length: number = 16): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

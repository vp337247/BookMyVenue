import * as crypto from 'crypto';

export function generateOtp(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otpCode = '';
  for (let i = 0; i < length; i++) {
    otpCode += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return otpCode;
}

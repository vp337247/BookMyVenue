import { z } from 'zod';

export const VerifyEmailSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  otpCode: z
    .string()
    .trim()
    .length(6, 'Verification code must be exactly 6 characters.')
    .regex(/^[A-Za-z0-9]+$/, 'Verification code must contain only letters and numbers.'),
});

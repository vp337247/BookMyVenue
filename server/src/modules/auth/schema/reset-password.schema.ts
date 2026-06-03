import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  otpCode: z
    .string()
    .trim()
    .length(6, 'Verification code must be exactly 6 characters.')
    .regex(/^[A-Za-z0-9]+$/, 'Verification code must contain only letters and numbers.'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long.'),
});

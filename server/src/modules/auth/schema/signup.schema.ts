import { z } from 'zod';

export const SignupSchema = z.object({
  firstName: z.string().trim().min(3, 'First Name is too short.').max(100),
  lastName: z.string().trim().max(100).optional(),
  email: z.email('Please enter a valid email address.'),
  phone: z.string().trim().min(5, 'Phone number is too short.').max(20, 'Phone number is too long.'),
  countryCode: z.string().trim().max(10, 'Country code is too long.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

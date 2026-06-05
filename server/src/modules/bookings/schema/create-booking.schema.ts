import { z } from 'zod';

export const CreateBookingSchema = z.object({
  venueId: z.string().uuid('Invalid venue ID format.'),
  startTime: z.date({
    message: 'Start time is required and must be a valid date.',
  }).refine((val) => val > new Date(), {
    message: 'Start time must be in the future.',
  }),
  endTime: z.date({
    message: 'End time is required and must be a valid date.',
  }),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after the start time.',
  path: ['endTime'],
});

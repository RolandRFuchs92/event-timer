import z from 'zod';

export const FinisherSchema = z.object({
  eventId: z.string()
});

import z from 'zod';

export const batchTimerSchema = z.object({
  batchId: z.string(),
  startTime: z.coerce.date()
});

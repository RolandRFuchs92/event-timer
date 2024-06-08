import z from 'zod';

export const BatchTimerSchema = z.object({
  raceId: z.string(),
  batchIndex: z.coerce.number(),
  startTime: z.coerce.date()
});

export const ResetBatchSchema = z.object({
  raceId: z.string(),
  batchIndex: z.coerce.number()
});

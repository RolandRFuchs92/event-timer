import z from 'zod';

export const BatchTimerSchema = z.object({
  batchId: z.string(),
  startTime: z.coerce.date()
});

export const ResetBatchSchema = z.object({
  batchId: z.string()
});

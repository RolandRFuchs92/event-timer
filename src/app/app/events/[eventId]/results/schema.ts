import z from 'zod';

export const FinisherFilterSchema = z.object({
  raceId: z.string(),
  refresh: z.coerce.number(),
  qualifier: z.coerce.boolean().default(false)
});

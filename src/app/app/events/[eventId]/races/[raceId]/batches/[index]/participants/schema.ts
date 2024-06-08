import z from 'zod';

export const GetBatchParticipantSchema = z.object({
  race_id: z.string(),
  batch_index: z.coerce.number()
});

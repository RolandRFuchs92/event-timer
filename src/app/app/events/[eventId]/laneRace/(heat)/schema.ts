import z from 'zod';

export const HeatDeleteParticipantSchema = z.object({
  particpant_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  race_id: z.string()
});

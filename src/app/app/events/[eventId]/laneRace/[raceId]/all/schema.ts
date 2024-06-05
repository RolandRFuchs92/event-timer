import z from 'zod';


export const TransferAllParticipantsSchema = z.object({
  raceId: z.string(),
  fromRoundIndex: z.coerce.number(),
  toRoundIndex: z.coerce.number()
});

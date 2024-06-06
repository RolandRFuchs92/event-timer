import z from 'zod';

export const TransferWinnersSchema = z.object({
  raceId: z.string(),
  fromRoundIndex: z.coerce.number(),
  toRoundIndex: z.coerce.number()
});

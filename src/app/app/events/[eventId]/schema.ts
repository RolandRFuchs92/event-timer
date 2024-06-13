import z from 'zod';

export const HomePageFilterSchema = z.object({
  eventId: z.string(),
  raceId: z.string()
});

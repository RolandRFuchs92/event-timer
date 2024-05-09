import z from "zod";

export const LaneRaceSchema = z.object({
  raceId: z.string(),
});

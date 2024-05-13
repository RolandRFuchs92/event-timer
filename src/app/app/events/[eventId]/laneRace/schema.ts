import z from "zod";

export const LaneRaceSchema = z.object({
  raceId: z.string(),
});

export const NewHeatSchema = z.object({
  name: z.string(),
  max_heats: z.coerce.number(),
  race_id: z.string()
});


export const DeleteHeatSchema = z.object({
  heat_index: z.coerce.number(),
  race_id: z.string()
});

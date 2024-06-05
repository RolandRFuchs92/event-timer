import z from "zod";

export const AssignRacersToRound = z.object({
  race_id: z.string(),
  roundIndex: z.coerce.number(),
  racers: z.array(
    z.object({
      participant_id: z.string(),
      isSelected: z.coerce.boolean(),
      name: z.string(),
      total_time_ms: z.string()
    })
  )
});

export const GetTopTimesOverMultipleRoundsSchema = z.object({
  race_id: z.string(),
  rounds: z.array(z.number()),
})

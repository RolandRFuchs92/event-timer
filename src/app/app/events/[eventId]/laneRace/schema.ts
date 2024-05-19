import z from "zod";

export const LaneRaceSchema = z.object({
  raceId: z.string(),
});

export const NewRoundSchema = z.object({
  name: z.string(),
  max_heats: z.coerce.number(),
  race_id: z.string(),
});

export const DeleteHeatSchema = z.object({
  heat_index: z.coerce.number(),
  race_id: z.string(),
});

export const NewHeatSchema = z.object({
  race_id: z.coerce.string(),
  heat_index: z.coerce.number(),
});

export const HeatFilterSchema = z.object({
  heat_index: z.coerce.number(),
});

export const LaneCloseSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.coerce.number(),
});

export const LaneCompetitorSchema = z.object({
  participant_id: z.string(),
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.coerce.number(),
});

export const LaneCompetitorHeatSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.coerce.number(),
  start_date: z.coerce.date().nullable()
});

export const FinishLaneRaceSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  finish_date: z.coerce.date(),
  participant_id: z.string()
});

export const HeatFormSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  finish_date: z.coerce.date(),
  participant_id: z.string()
});

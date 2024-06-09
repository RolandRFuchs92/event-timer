import { ParticipantHeatStatusEnum } from "@prisma/client";
import z from "zod";

export const LaneRaceSchema = z.object({
  raceId: z.string(),
});

export const NewRoundSchema = z.object({
  name: z.string(),
  race_id: z.string(),
});

export const DeleteRoundSchema = z.object({
  round_index: z.coerce.number(),
  race_id: z.string(),
});

export const NewHeatSchema = z.object({
  race_id: z.coerce.string(),
  round_index: z.coerce.number(),
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
  start_date: z.coerce.date().nullable(),
});

export const FinishLaneRaceSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  finish_date: z.coerce.date(),
  participant_id: z.string(),
});

export const HeatFormSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  finish_date: z.coerce.date(),
  participant_id: z.string(),
});

export const HeatParticipantSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  heat_index: z.number(),
  end_time: z.string().nullable(),
  participant_id: z.string(),
  status: z.nativeEnum(ParticipantHeatStatusEnum),
});

export const MoveWinersSchema = z.object({
  race_id: z.string(),
  round_index: z.number()
});

export const RemoveCompetitorSchema = z.object({
  race_id: z.string(),
  round_index: z.number(),
  participant_id: z.string()
});


export const ChangeRoundQualifierStatus = z.object({
  race_id: z.string(),
  roundIndex: z.coerce.number(),
  qualifer: z.coerce.boolean()
});

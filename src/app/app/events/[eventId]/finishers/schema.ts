import { OptionSchema } from "@/js/schema";
import { FinishStatusEnum, RaceTypeEnum } from "@prisma/client";
import z from "zod";

export const FinishersFilterSchema = z.object({
  races: z.array(OptionSchema),
  race_type: z.nativeEnum(RaceTypeEnum)
});

export const FinisherSchema = z.object({
  raceIds: z.array(z.string()),
  race_number: z.string(),
  event_id: z.string(),
  finish_status: z.nativeEnum(FinishStatusEnum),
  finish_time: z.coerce.date(),
});

export const DeleteFinisherSchema = z.object({
  participantId: z.string(),
  race_ids: z.array(z.string()),
});

export const ChangeParticipantFinishStatusSchema = z.object({
  participantId: z.string(),
  finish_status: z.nativeEnum(FinishStatusEnum),
  finish_time: z.coerce.date(),
  raceIds: z.array(z.string())
});

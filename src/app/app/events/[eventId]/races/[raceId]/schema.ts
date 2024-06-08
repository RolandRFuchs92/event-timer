import { MONGO_UPSERT_HACK } from "@/lib/db";
import { RaceTypeEnum } from "@prisma/client";
import z from "zod";

export const RaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  event_id: z.string(),
  race_type: z.nativeEnum(RaceTypeEnum),
  batches: z.array(
    z.object({
      index: z.coerce.number(),
      name: z.string(),
      start_on: z.coerce.date().nullish(),
    }),
  ),
});

export const DefaultRace: z.infer<typeof RaceSchema> = {
  id: MONGO_UPSERT_HACK,
  event_id: MONGO_UPSERT_HACK,
  race_type: RaceTypeEnum.StandardNoLaps,
  name: "",
  batches: [],
};

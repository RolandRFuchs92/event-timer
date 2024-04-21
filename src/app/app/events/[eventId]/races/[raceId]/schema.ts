import { MONGO_UPSERT_HACK } from "@/lib/db";
import z from "zod";

export const RaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  event_id: z.string(),
  batches: z.array(
    z.object({
      batch_id: z.string().nullish(),
      name: z.string(),
      start_on: z.coerce.date().nullish(),
    }),
  ),
});

export const DefaultRace: z.infer<typeof RaceSchema> = {
  id: MONGO_UPSERT_HACK,
  event_id: MONGO_UPSERT_HACK,
  name: "",
  batches: [],
};

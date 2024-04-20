import { OptionSchema } from "@/js/schema";
import { MONGO_UPSERT_HACK } from "@/lib/db";
import z from "zod";

export const EventSchema = z.object({
  id: z.string(),
  client_id: z.string(),
  name: z.string(),
  start_on: z.coerce.date().default(new Date()),
  end_on: z.coerce.date().nullable(),
  created_on: z.coerce.date(),
  event_type: z.array(OptionSchema),
});

export const DefaultEvent: z.infer<typeof EventSchema> = {
  id: MONGO_UPSERT_HACK,
  client_id: "",
  name: "",
  start_on: null as any as Date,
  end_on: null as any as Date,
  created_on: null as any as Date,
  event_type: [],
};

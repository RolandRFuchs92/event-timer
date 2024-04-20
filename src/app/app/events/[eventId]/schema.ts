import { MONGO_UPSERT_HACK } from "@/lib/db";
import z from "zod";

export const EventSchema = z.object({
  id: z.string(),
  client_id: z.string(),
  name: z.string(),
  start_on: z.date(),
  end_on: z.date(),
  created_on: z.date(),
  event_type: z.string().array(),
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

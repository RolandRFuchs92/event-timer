"use client";

import z from "zod";

import { MONGO_UPSERT_HACK } from "@/lib/db";

export const RegistrationSchema = z.object({
  event_id: z.string(),
  id: z.coerce.string(),
  first_name: z.string().min(2),
  last_name: z.string(),
  birthdate: z.coerce.date(),
  batches: z.array(
    z.object({
      race_id: z.string(),
      batch_index: z.string(),
    }),
  ),
  is_male: z.coerce.boolean(),
});

export const DefaultRegistration: z.infer<typeof RegistrationSchema> = {
  event_id: "",
  id: "",
  first_name: "",
  last_name: "",
  birthdate: null as any,
  batches: [
    {
      race_id: "",
      batch_index: "",
    },
  ],
  is_male: false,
};

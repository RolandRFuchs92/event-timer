"use client";

import { MONGO_UPSERT_HACK } from "@/lib/db";
import z from "zod";

export const RegistrationSchema = z.object({
  id: z.coerce.string(),
  first_name: z.string().min(2),
  last_name: z.string(),
  race_number: z.string().nullable(),
  birthdate: z.coerce.date(),
  batches: z.array(
    z.object({
      race_id: z.string(),
      batch_id: z.string(),
    }),
  ),
  is_male: z.coerce.boolean(),
});

export const DefaultRegistration: z.infer<typeof RegistrationSchema> = {
  id: MONGO_UPSERT_HACK,
  first_name: "",
  last_name: "",
  birthdate: null as any,
  race_number: "",
  batches: [
    {
      race_id: "" as any,
      batch_id: "" as any,
    },
  ],
  is_male: false,
};

"use client";

import z from "zod";

export const RegistrationSchema = z.object({
  id: z.coerce.number().optional(),
  first_name: z.string().min(2),
  last_name: z.string(),
  race_number: z.string().optional(),
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
  first_name: "",
  last_name: "",
  birthdate: null as any,
  race_number: "",
  batches: [
    {
      race_id: undefined as any,
      batch_id: null as any,
    },
  ],
  is_male: false,
};

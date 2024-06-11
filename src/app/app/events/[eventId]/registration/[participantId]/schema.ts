import z from "zod";

export const RegistrationSchema = z.object({
  event_id: z.string(),
  id: z.coerce.string(),
  email: z.string(),
  first_name: z.string().min(2),
  last_name: z.string(),
  birthdate: z.coerce.date(),
  race_number: z.string().optional(),
  races: z.array(
    z.object({
      race_id: z.string(),
      batch_index: z.coerce.string().nullable(),
    }),
  ),
  is_male: z.coerce.boolean(),
});

export const DefaultRegistration: z.infer<typeof RegistrationSchema> = {
  event_id: "",
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  race_number: "",
  birthdate: null as any,
  races: [
    {
      race_id: "",
      batch_index: "",
    },
  ],
  is_male: false,
};

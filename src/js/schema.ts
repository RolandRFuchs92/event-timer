import z from "zod";

export const OptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.coerce.boolean(),
});

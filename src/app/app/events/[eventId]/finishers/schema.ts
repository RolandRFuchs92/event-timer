import { OptionSchema } from "@/js/schema";
import z from "zod";

export const FinishersFilterSchema = z.object({
  races: z.array(OptionSchema),
});

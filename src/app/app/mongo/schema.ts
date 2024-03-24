import z from "zod";

export const someForm = z.object({
  name: z.string(),
  lastName: z.string(),
});

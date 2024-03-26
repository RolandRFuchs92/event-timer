import { RoleEnum } from "@prisma/client";
import z from "zod";

export const someForm = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .transform((i) => i.map((i) => i.value as RoleEnum)),
});

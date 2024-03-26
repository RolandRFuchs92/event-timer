import { RoleEnum } from "@prisma/client";
import z from "zod";

export const AccountSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    roles: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .transform((i) => i.map((i) => i.value as RoleEnum)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export const AccountDefaultValues: z.infer<typeof AccountSchema> = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  confirmPassword: "",
  password: "",
  roles: [],
};

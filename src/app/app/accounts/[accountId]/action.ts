"use server";
import z from "zod";
import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { enumToOptions, mongoEnumToOptions } from "@/lib/helper";
import { AccountDefaultValues } from "../schema";

export const getAccount = action(z.string(), async (id) => {
  if (id === "null") return AccountDefaultValues;

  const user = await _db.account.findFirst({
    where: {
      id,
    },
  });

  const { password, roles, ...result } = user!;
  const newRoles = mongoEnumToOptions(roles);

  return {
    ...result,
    password: "",
    roles: newRoles,
  };
});

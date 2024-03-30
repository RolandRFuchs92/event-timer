"use server";
import z from "zod";
import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";

export const getAccount = action(z.string(), async (id) => {
  const user = await _db.account.findFirst({
    where: {
      id,
    },
  });

  const { password, ...result } = user!;

  return {
    ...result,
    password: "",
  };
});

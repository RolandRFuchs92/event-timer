"use server";
import { _db } from "@/lib/db";

export async function getAccount(id: string) {
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
}

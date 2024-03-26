"use server";

import z from "zod";
import bcrypt from "bcryptjs";

import { MONGO_UPSERT_HACK, _db } from "@/lib/db";

import { AccountSchema } from "./schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function getAccounts() {
  unstable_noStore();
  const accounts = await _db.account.findMany();
  return accounts;
}

export async function deleteAccount(id: string) {
  try {
    const result = await _db.account.delete({
      where: {
        id,
      },
    });

    revalidatePath("/app/accounts");

    return {
      message: `Successfully delete ${result.firstName} account.`,
    };
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError)
      if (e.code === "P2025") {
        throw new Error("Record no longer exists.");
      }
    throw e;
  }
}

export async function createNewEntry(data: z.infer<typeof AccountSchema>) {
  const password = await new Promise<string>((res, rej) =>
    bcrypt.hash(data.password, 10, (err, hash: string) => {
      if (err) rej(err);
      else res(hash);
    }),
  );
  const { confirmPassword, id, ...input } = data;

  const result = await _db.account.upsert({
    create: {
      ...input,
      password,
    },
    update: {
      ...input,
      password,
    },
    where: {
      id: id || MONGO_UPSERT_HACK,
    },
  });

  revalidatePath("/app/accounts");
  return result;
}

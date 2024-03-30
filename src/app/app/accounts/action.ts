"use server";

import z, { EnumValues } from "zod";
import bcrypt from "bcryptjs";

import { MONGO_UPSERT_HACK, _db } from "@/lib/db";

import { AccountSchema } from "./schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, unstable_noStore } from "next/cache";
import { action } from "@/lib/safeAction";
import { RoleEnum } from "@prisma/client";

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

export const createNewEntry = action(AccountSchema, async (data) => {
  const password = await new Promise<string>((res, rej) =>
    bcrypt.hash(data.password, 10, (err, hash: string) => {
      if (err) rej(err);
      else res(hash);
    }),
  );
  const { confirmPassword, id, roles, ...input } = data;

  const result = await _db.account.upsert({
    create: {
      ...input,
      password,
      roles: roles.map((i) => i.value as RoleEnum),
    },
    update: {
      ...input,
      password,
      roles: roles.map((i) => i.value as RoleEnum),
    },
    where: {
      id: id || MONGO_UPSERT_HACK,
    },
  });

  revalidatePath("/app/accounts");
  return result;
});

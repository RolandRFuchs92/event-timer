"use server";

import z from "zod";

import { _db } from "@/lib/db";

import { someForm } from "./schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createNewEntry(data: z.infer<typeof someForm>) {
  const result = await _db.account.create({
    data: {
      ...data,
    },
  });
  revalidatePath("/app/accounts");
  return result;
}

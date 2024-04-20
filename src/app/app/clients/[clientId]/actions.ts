"use server";

import { _db } from "@/lib/db";
import { DefaultClient, clientSchema } from "./schema";
import { z } from "zod";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

export async function getAccountOptions() {
  unstable_noStore();
  const accounts = await _db.account.findMany({});

  const accountOptions = accounts.map((i) => ({
    label: `${i.firstName} ${i.lastName}`,
    value: i.id,
  }));

  return accountOptions;
}

export async function mutateClient({
  id,
  ...client
}: z.infer<typeof clientSchema>) {
  const result = await _db.client.upsert({
    update: client,
    create: client,
    where: {
      id,
    },
  });

  revalidatePath("/app/clients");
  return {
    message: `Successfully mutated ${result.name}!`,
    result,
  };
}

export async function getClient(clientId: string) {
  if (clientId === "null") return DefaultClient;

  unstable_noStore();
  const client = await _db.client.findFirst({
    where: {
      id: clientId,
    },
  });

  if (!client) return DefaultClient;
  return client;
}

"use server";

import { _db } from "@/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function getClients() {
  unstable_noStore();
  const clients = await _db.client.findMany({
    include: {
      account: true,
    },
  });

  return clients;
}

export async function deleteClient(clientId: string) {
  const result = await _db.client.delete({
    where: {
      id: clientId,
    },
  });

  revalidatePath("/app/clients");
  return {
    message: `Successfully deleted ${result.name}!`,
    result,
  };
}

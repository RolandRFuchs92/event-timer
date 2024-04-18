"use server";

import { _db } from "@/lib/db";

export async function getClients() {
  const clients = await _db.client.findMany({
    include: {
      account: true,
    },
  });

  return clients;
}

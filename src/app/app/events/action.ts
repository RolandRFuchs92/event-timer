"use server";

import { _db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteEvent(eventId: string) {
  const result = await _db.event.delete({
    where: {
      id: eventId,
    },
  });

  revalidatePath("");

  return {
    message: `Successfully deleted event - TEST`,
    result,
  };
}

export async function getEvents() {
  const result = await _db.event.findMany({
    include: {
      client: true,
    },
  });

  return result;
}

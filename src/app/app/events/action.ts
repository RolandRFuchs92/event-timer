"use server";

import { _db } from "@/lib/db";

export async function deleteEvent(eventId: string) {
  const result = await _db.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    message: `Successfully deleted event - TEST`,
    result,
  };
}

export async function getEvents() {
  const result = await _db.event.findMany({});

  return result;
}

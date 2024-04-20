"use server";

import { _db } from "@/lib/db";

export async function deleteEvent(eventId: string) {
  return {
    message: `Successfully deleted event - TEST`,
  };
}

export async function getEvents() {
  const result = await _db.
    return[];
}

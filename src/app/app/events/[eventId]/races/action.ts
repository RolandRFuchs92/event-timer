"use server";

import { _db } from "@/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function deleteRace(raceId: string) {
  const result = await _db.races.delete({
    where: {
      id: raceId,
    },
  });

  revalidatePath("");

  return {
    result,
    message: `Successfully deleted that race.`,
  };
}

export async function getEventRaces(eventId: string) {
  unstable_noStore();
  const result = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  return result;
}

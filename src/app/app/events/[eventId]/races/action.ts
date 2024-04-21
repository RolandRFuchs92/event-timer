"use server";

import { _db } from "@/lib/db";

export async function deleteRace(raceId: string) {
  return {
    message: `Successfully deleted that race.`,
  };
}

export async function getEventRaces(eventId: string) {
  const result = await _db.race.findMany({
    where: {
      id: eventId,
    },
  });

  return result;
}

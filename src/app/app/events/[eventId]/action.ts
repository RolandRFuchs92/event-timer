"use server";

import { _db } from "@/lib/db";
import { unstable_noStore } from "next/cache";

export async function getRace(raceId: string) {
  unstable_noStore();
  const race = await _db.races.findFirst({
    where: {
      id: raceId,
    },
  });

  if (!race) throw new Error("Unable to find that race!");

  return race;
}

export async function getRaces(eventId: string) {
  unstable_noStore();
  const races = await _db.races.findMany({
    where: {
      event_id: eventId
    }
  });

  return races;
}

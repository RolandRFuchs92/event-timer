"use server";

import { _db } from "@/lib/db";

export async function getRace(raceId: string) {
  const race = await _db.races.findFirst({
    where: {
      id: raceId,
    },
  });

  if (!race) throw new Error("Unable to find that race!");

  return race;
}

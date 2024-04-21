"use server";

import { _db } from "@/lib/db";
import { DefaultRace } from "./schema";
import { revalidatePath, unstable_noStore } from "next/cache";
import { newObjectId } from "@/lib/helper";

export async function getRace(raceId: string) {
  if (raceId === "null") return DefaultRace;

  unstable_noStore();
  const result = await _db.races.findFirst({
    where: {
      id: raceId,
    },
  });

  if (result === null) return DefaultRace;

  return result;
}

export async function mutateRace({ id, ...rawRace }: typeof DefaultRace) {
  const race = {
    ...rawRace,
    batches: rawRace.batches.map((i) => ({
      ...i,
      batch_id: newObjectId().toString(),
    })),
  };

  const result = await _db.races.upsert({
    create: race,
    update: race,
    where: {
      id: id,
    },
  });

  revalidatePath(".");

  return {
    result,
    message: `Successfully created ${result.name} race!`,
  };
}

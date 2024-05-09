"use server";

import { _db } from "@/lib/db";
import { DefaultRace, RaceSchema } from "./schema";
import { revalidatePath, unstable_noStore } from "next/cache";
import { newObjectId } from "@/lib/helper";
import { heat_container, races } from "@prisma/client";
import { action } from "@/lib/safeAction";

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

export const mutateRace = action(RaceSchema, async ({ id, ...rawRace }) => {
  const isLaneRace = rawRace.race_type === "LaneRace";
  const currentRace = await _db.races.findFirst({
    where: {
      id
    }
  });

  if (currentRace) {

    return {
      message: `Successfully mutated ${rawRace.name}!`
    }
  }

  const heatContainers: heat_container[] = isLaneRace
    ? [
      {
        name: "Qualifier",
        heats: [],
        is_closed: false,
        max_heats: 0,
        heat_index: 0,
        is_qualifier: true,
        all_participant_ids: [],
      },
    ]
    : [];

  const batches: Omit<races, "id">["batches"] = isLaneRace
    ? rawRace.batches.map((i) => ({
      ...i,
      batch_id: newObjectId().toString(),
      name: i.name,
      start_on: null,
    }))
    : [];

  const race: Omit<races, "id"> = {
    ...rawRace,
    heat_containers: heatContainers,
    batches,
  };

  const result = await _db.races.create({
    data: race,
  });

  revalidatePath(".");

  return {
    result,
    message: `Successfully created ${result.name} race!`,
  };
})

"use server";

import { _db } from "@/lib/db";
import { omit } from "lodash";
import { revalidatePath, unstable_noStore } from "next/cache";
import { DeleteRaceSchema } from "./schema";
import { action } from "@/lib/safeAction";

export const deleteRace = action(DeleteRaceSchema, async (raceId) => {
  const result = await _db.races.delete({
    where: {
      id: raceId,
    },
  });

  if (!result) {
    throw new Error("Unable to find that race!");
  }

  const raceParticipants = await _db.participant.findMany({
    where: {
      OR: [
        {
          races: {
            some: {
              race_id: raceId,
            },
          },
        },
        {
          batches: {
            some: {
              race_id: raceId,
            },
          },
        },
      ],
    },
  });

  await _db.$transaction(
    raceParticipants.map((i) =>
      _db.participant.update({
        data: {
          ...omit(i, "id"),
          races: i.races.filter((r) => r.race_id !== raceId),
          batches: i.batches.filter((b) => b.race_id !== raceId),
        },
        where: {
          id: i.id,
        },
      }),
    ),
  );

  revalidatePath("");

  return {
    result,
    message: `Successfully deleted that race.`,
  };
});

export async function getEventRaces(eventId: string) {
  unstable_noStore();
  const result = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  return result;
}

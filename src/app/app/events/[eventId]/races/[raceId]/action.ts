"use server";

import { races } from "@prisma/client";
import { revalidatePath, unstable_noStore } from "next/cache";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";

import { DefaultRace, RaceSchema } from "./schema";
import { z } from "zod";

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

export const mutateRace = action(RaceSchema, async (input) => {
  const isLaneRace = input.race_type === "LaneRace";
  const currentRace = await _db.races.findFirst({
    where: {
      id: input.id,
    },
  });

  revalidatePath(".");

  if (isLaneRace) {
    const result = await mutateLaneRace(currentRace, input);

    return {
      result,
      message: `Successfully created ${result.name} race!`,
    };
  }

  const result = await mutateStandardRace(currentRace, input);

  return {
    result,
    message: `Successfully created ${result.name} race!`,
  };
});

async function mutateStandardRace(
  race: races | null,
  input: z.infer<typeof RaceSchema>,
) {
  if (!race) {
    const result = await _db.races.create({
      data: {
        name: input.name,
        event_id: input.event_id,
        rounds: [],
        batches: input.batches.map((i, index) => {
          return {
            ...i,
            index,
          };
        }),
        race_type: input.race_type,
      },
    });

    return result;
  }

  const batchesToDelete = race.batches
    .filter((i) => !input.batches.map((i) => i.index).includes(i.index))
    .map((i) => i.index);

  if (batchesToDelete.length) {
    await _db.$runCommandRaw({
      update: "races",
      updates: batchesToDelete.map((i) => ({
        q: {
          _id: {
            $oid: race.id,
          },
        },
        u: {
          $pull: {
            batches: {
              index: i,
            },
          },
        },
      })),
    });
  }

  const updatedBatchesResult = await _db.$runCommandRaw({
    update: "races",
    updates: input.batches.flatMap((i, index) => {
      const update = {
        $set: {
          [`batches.${index}.name`]: i.name,
          [`batches.${index}.index`]: index,
        },
      };

      const push = {
        $push: {
          batches: {
            index,
            name: i.name,
            start_on: null,
          },
        },
      };

      const updateStatement = i.index === -1 ? push : update;

      return [
        {
          q: {
            _id: {
              $oid: race.id,
            },
          },
          u: updateStatement,
        },
      ];
    }),
  });

  const result = await _db.races.update({
    data: {
      name: input.name,
      rounds: [],
      race_type: input.race_type,
    },
    where: {
      id: input.id,
    },
  });

  return result;
}

async function mutateLaneRace(
  race: races | null,
  input: z.infer<typeof RaceSchema>,
) {
  if (!race) {
    const result = await _db.races.create({
      data: {
        name: input.name,
        event_id: input.event_id,
        rounds: [
          {
            name: "Qualifier",
            heats: [],
            round_index: 0,
            is_qualifier: true,
            all_participant_ids: [],
          },
        ],
        batches: [],
        race_type: input.race_type,
      },
    });
    return result;
  }

  const result = await _db.races.update({
    data: {
      name: input.name,
      race_type: input.race_type,
      batches: [],
    },
    where: {
      id: input.id,
    },
  });
  return result;
}

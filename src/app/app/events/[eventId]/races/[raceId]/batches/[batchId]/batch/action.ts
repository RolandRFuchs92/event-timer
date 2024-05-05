"use server";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { BatchTimerSchema, ResetBatchSchema } from "./schema";
import { races } from "@prisma/client";
import { omit } from "lodash";
import { revalidatePath } from "next/cache";

export const startBatchTimer = action(
  BatchTimerSchema,
  async ({ batchId, startTime }) => {
    const race = await _db.races.findFirst({
      where: {
        batches: {
          some: {
            batch_id: batchId,
          },
        },
      },
    });

    if (!race) throw new Error("Unable to find that batch!");

    let batchName = "";
    const newRace: Omit<races, "id"> = {
      name: race.name,
      event_id: race.event_id,
      race_type: race.race_type,
      batches: race.batches.map((i) => {
        if (i.batch_id !== batchId) return i;
        batchName = i.name;

        return {
          ...i,
          start_on: startTime,
        };
      }),
    };

    const result = await _db.races.update({
      data: {
        ...newRace,
      },
      where: {
        id: race.id,
      },
    });

    return {
      result,
      message: `Successfully started batch ${batchName}`,
    };
  },
);

export const resetBatchTimer = action(ResetBatchSchema, async ({ batchId }) => {
  const race = await _db.races.findFirst({
    where: {
      batches: {
        some: {
          batch_id: batchId,
        },
      },
    },
  });

  if (!race) throw new Error("Unable to find that batch!");

  let batchName = "";
  var newRace = {
    ...race,
    batches: race.batches.map((i) => {
      if (i.batch_id === batchId) batchName = i.name;

      return {
        ...i,
        start_on: null,
      };
    }),
  };

  await _db.races.update({
    data: {
      ...omit(newRace, "id"),
    },
    where: {
      id: race.id,
    },
  });

  revalidatePath("");
  return {
    message: `Successfully reset ${batchName}!`,
  };
});

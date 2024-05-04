"use server";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { batchTimerSchema } from "./schema";
import { races } from "@prisma/client";

export const startBatchTimer = action(
  batchTimerSchema,
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

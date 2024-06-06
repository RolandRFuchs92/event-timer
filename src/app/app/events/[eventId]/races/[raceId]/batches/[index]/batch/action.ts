"use server";

import { revalidatePath } from "next/cache";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { getRace } from "@/app/app/events/[eventId]/action";

import { BatchTimerSchema, ResetBatchSchema } from "./schema";

export const startBatchTimer = action(
  BatchTimerSchema,
  async (input) => {
    const race = await getRace(input.raceId);

    const result = await _db.races.update({
      data: {
        batches: {
          updateMany: {
            data: {
              start_on: input.startTime
            },
            where: {
              index: input.batchIndex
            }
          }
        }
      },
      where: {
        id: race.id,
      },
    });

    const batchName = race.batches[input.batchIndex];
    revalidatePath('.');

    return {
      result,
      message: `Successfully started batch ${batchName}`,
    };
  },
);

export const resetBatchTimer = action(ResetBatchSchema, async (input) => {
  const result = await _db.races.update({
    data: {
      batches: {
        updateMany: {
          data: {
            start_on: null
          },
          where: {
            index: input.batchIndex
          }
        }
      }
    },
    where: {
      id: input.raceId,
    },
  });

  const batchName = result.batches[input.batchIndex].name;

  revalidatePath("");
  return {
    message: `Successfully reset ${batchName}!`,
  };
});

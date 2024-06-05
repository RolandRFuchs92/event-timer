"use server";

import { action } from "@/lib/safeAction";
import { TransferAllParticipantsSchema } from "./schema";
import { _db } from "@/lib/db";
import { uniq } from "lodash";
import { revalidatePath } from "next/cache";

export const transferAllParticipants = action(
  TransferAllParticipantsSchema,
  async (input) => {
    if (input.fromRoundIndex === input.toRoundIndex)
      throw new Error(
        "You may not transfer from one round and back to itself.",
      );

    const race = await _db.races.findFirst({
      where: {
        id: input.raceId,
      },
    });

    if (!race) throw new Error("Unable to find that race. Please try again.");

    const fromRound = race.rounds.find(
      (i) => i.round_index === input.fromRoundIndex,
    );
    const toRound = race.rounds.find(
      (i) => i.round_index === input.toRoundIndex,
    );

    if (!fromRound) {
      throw new Error("Unable to find the 'From' round.");
    }

    if (!toRound) {
      throw new Error("Unable to find the 'To' round.");
    }

    const newParticipants = uniq([
      ...toRound.all_participant_ids,
      ...fromRound.all_participant_ids,
    ]);
    const result = await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              all_participant_ids: newParticipants,
            },
            where: {
              round_index: input.toRoundIndex,
            },
          },
        },
      },
      where: {
        id: input.raceId,
      },
    });

    revalidatePath(`/app/events/${race.event_id}/laneRace`);

    return {
      result,
      message: `Successfully moved participants to new round.`,
    };
  },
);

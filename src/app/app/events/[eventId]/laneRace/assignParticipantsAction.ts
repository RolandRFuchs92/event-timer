"use server";

import { action } from "@/lib/safeAction";
import {
  AssignRacersToRound,
  GetTopTimesOverMultipleRoundsSchema,
} from "./schema";
import { _db } from "@/lib/db";
import { uniqBy } from "lodash";
import { revalidatePath } from "next/cache";

export const getTopTimesOverMultipleRounds = action(
  GetTopTimesOverMultipleRoundsSchema,
  async (input) => {
    var race = await _db.races.findFirst({
      where: {
        id: input.race_id,
      },
    });

    if (!race) throw new Error("Unable to find that race!");

    var selectedRounds = race.rounds.filter((i) =>
      input.rounds.includes(i.round_index),
    );
    var allParticipants = selectedRounds.flatMap((i) =>
      i.heats.flatMap((i) => i.participants),
    );
    var filteredParticipants = allParticipants.filter((i) => !!i.total_time_ms);
    var orderedParticipantTimes = filteredParticipants.sort(
      (a, b) => +b.total_time_ms! - +a.total_time_ms!,
    );
    var participantBestTimes = uniqBy(
      orderedParticipantTimes,
      "participant_id",
    );

    return {
      result: participantBestTimes,
      message: "Top times successfully collected.",
    };
  },
);

export const assignParticipants = action(AssignRacersToRound, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },

  });

  if (!race) throw new Error("Unable to find that race!");

  const currentRacers = race.rounds[input.roundIndex].all_participant_ids;

  const newRacers = input.racers.filter(
    (i) => !currentRacers.includes(i.participant_id) && i.isSelected === true
  );

  await _db.races.update({
    data: {
      rounds: {
        updateMany: {
          data: {
            all_participant_ids: {
              push: newRacers.map(i => i.participant_id)
            }
          },
          where: {
            round_index: input.roundIndex
          }
        }
      },
    },
    where: {
      id: input.race_id,
    },
  });

  const newRound = race.rounds[input.roundIndex];
  console.log("BOOP");

  revalidatePath("");
  return {
    message: `Successfully added new participants to ${newRound.name}`
  }
});

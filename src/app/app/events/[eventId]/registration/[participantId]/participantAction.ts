"use server";

import { z } from "zod";

import { _db } from "@/lib/db";

import { RegistrationSchema } from "./schema";
import { mapRelatedRacesToParticipantBatchs } from "./participantMapper";
import { participant_race } from "@prisma/client";
import { originalPathname } from "next/dist/build/templates/app-page";

export async function createNewParticipant(
  input: z.infer<typeof RegistrationSchema>,
) {
  const newRaceNumber = await getNewRaceNumber(input.event_id);

  const relatedRaces = await _db.races.findMany({
    where: {
      id: {
        in: input.batches.map((i) => i.race_id),
      },
    },
  });

  const newParticipantResult = await _db.participant.create({
    data: {
      birthdate: input.birthdate,
      event_id: input.event_id,
      is_male: input.is_male,
      last_name: input.last_name,
      first_name: input.first_name,
      race_number: newRaceNumber.toString(),
      races: await mapRelatedRacesToParticipantBatchs(input, relatedRaces),
    },
  });

  for (const race of relatedRaces) {
    const relativeRaceInput = input.batches.find((i) => i.race_id === race.id);
    if (!relativeRaceInput) continue;

    if (race.race_type === "StandardNoLaps") {
      await _db.races.update({
        data: {
          batches: {
            updateMany: {
              data: {
                participants: {
                  push: {
                    participant_id: newParticipantResult.id,
                    time_taken: null,
                    finish_time: null,
                    finish_status: null,
                    time_taken_ms: null,
                  },
                },
              },
              where: {
                index: +relativeRaceInput.batch_index,
              },
            },
          },
        },
        where: {
          id: race.id,
        },
      });

      continue;
    }

    await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              all_participant_ids: {
                push: newParticipantResult.id,
              },
            },
            where: {
              round_index: 0,
            },
          },
        },
      },
      where: {
        id: relativeRaceInput.race_id,
      },
    });
  }
}

async function getNewRaceNumber(eventId: string) {
  const event = await _db.event.findFirst({
    where: {
      id: eventId,
    },
  });

  if (!event) throw new Error("Unable to find the requested event.");

  const newRaceNumber = event.last_race_number + 1;
  await _db.event.update({
    data: {
      last_race_number: newRaceNumber,
    },
    where: {
      id: eventId,
    },
  });

  return newRaceNumber;
}

export async function updateParticipant(
  input: z.infer<typeof RegistrationSchema>,
) {
  const relatedRaces = await _db.races.findMany({
    where: {
      id: {
        in: input.batches.map((i) => i.race_id),
      },
    },
  });

  const originalParticipant = await _db.participant.findFirst({
    where: {
      id: input.id,
    },
  });

  const participantResult = await _db.participant.update({
    data: {
      is_male: input.is_male,
      first_name: input.first_name,
      last_name: input.last_name,
      birthdate: input.birthdate,
      races: mapRelatedRacesToParticipantBatchs(input, relatedRaces),
    },
    where: {
      id: input.id,
    },
  });

  const participantRaces = originalParticipant!.races;

  for (const participantRace of participantRaces) {
    const isStillInRace = input.batches.some(
      (i) => i.race_id === participantRace.race_id,
    );
    if (!isStillInRace) {
      await pullParticipantFromRace(input.id, participantRace);
      continue;
    }


    ///WHat about if the batch changes?
  }

  for (const incomingRace of input.batches) {
    const originalRaceRef = originalParticipant?.races.find(
      (i) => i.race_id === incomingRace.race_id,
    );
    const raceRef = relatedRaces.find((i) => i.id === incomingRace.race_id)!;

    if (!originalRaceRef) {
      if (raceRef.race_type === "StandardNoLaps") {
        await _db.races.update({
          data: {
            batches: {
              updateMany: {
                data: {
                  participants: {
                    push: {
                      time_taken_ms: null,
                      finish_status: null,
                      finish_time: null,
                      time_taken: null,
                      participant_id: originalParticipant!.id,
                    },
                  },
                },
                where: {
                  index: +incomingRace.batch_index,
                },
              },
            },
          },
          where: {
            id: incomingRace.race_id,
          },
        });
        continue;
      }

      await _db.races.update({
        data: {
          rounds: {
            updateMany: {
              data: {
                all_participant_ids: {
                  push: originalParticipant!.id,
                },
              },
              where: {
                round_index: 0
              },
            },
          },
        },
        where: {
          id: incomingRace.race_id,
        },
      });
    }
  }
}

async function pullParticipantFromRace(
  participantId: string,
  participantRace: participant_race,
) {
  const isBatch = !!participantRace.batch_index;

  if (isBatch) {
    const deletedResult = await _db.$runCommandRaw({
      update: "races",
      updates: [
        {
          q: {
            _id: {
              $oid: participantRace.race_id,
            },
          },
          u: {
            $pull: {
              "batches.$[].participants": {
                participant_id: participantId,
              },
            },
          },
        },
      ],
    });
    console.log(deletedResult);
    return;
  }

  const deletedResult = await _db.$runCommandRaw({
    update: "races",
    updates: [
      {
        q: {
          _id: {
            $oid: participantRace.race_id,
          },
        },
        u: {
          $pull: {
            "rounds.$[].all_participant_ids": participantId,
          },
        },
      },
    ],
  });
  console.log(deletedResult);
}

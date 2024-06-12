"use server";

import { uniq } from "lodash";
import { differenceInMilliseconds, differenceInYears } from "date-fns";
import { revalidatePath, unstable_noStore } from "next/cache";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { getTimerDifference } from "@/lib/getTimerDifference";

import {
  ChangeParticipantFinishStatusSchema,
  DeleteFinisherSchema,
  FinisherSchema,
} from "./schema";

export async function getFinishers(raceIds: string[]) {
  unstable_noStore();

  const races = await _db.races.findMany({
    where: {
      id: {
        in: raceIds,
      },
    },
  });

  const allParticipantIds = uniq(
    races.flatMap((i) =>
      i.batches.flatMap((i) => i.participants.map((i) => i.participant_id)),
    ),
  );
  const rawParticipants = await _db.participant.findMany({
    where: {
      id: {
        in: allParticipantIds,
      },
    },
  });

  const result = races.flatMap((r) => {
    const participants = r.batches
      .flatMap((b) => {
        return b.participants.map((p) => {
          const me = rawParticipants.find((i) => i.id === p.participant_id)!;

          return {
            first_name: me.first_name,
            last_name: me.last_name,
            race_number: me.race_number,
            age: differenceInYears(new Date(), me.birthdate),
            participant_id: me.id,
            race: r.name,
            finish_status: p.finish_status,
            race_id: r.id,
            batch_index: b.index,
            batch_start_on: b.start_on!,
            batch: b.name!,
            start_on: b.start_on,
            finish_time: p.finish_time,
            time_taken: p.time_taken,
            time_taken_ms: p.time_taken_ms,
          };
        });
      })
      .filter((i) => !!i.start_on && !!i.finish_time)
      .sort((a, b) => +b.finish_time! - +a.finish_time!);

    return participants;
  });

  return result;
}

export const deleteFinisher = action(
  DeleteFinisherSchema,
  async ({ participantId, race_ids }) => {
    const participant = await _db.participant.findFirst({
      where: {
        id: participantId,
      },
    });

    if (!participant) {
      throw new Error("Unable to find that participant.");
    }

    await _db.races.updateMany({
      data: {
        batches: {
          updateMany: {
            data: {
              participants: {
                participant_id: participantId,
                finish_time: null,
                finish_status: null,
                time_taken: null,
                time_taken_ms: null,
              },
            },
            where: {
              participants: {
                some: {
                  participant_id: participantId,
                },
              },
            },
          },
        },
      },
      where: {
        id: {
          in: race_ids,
        },
      },
    });

    revalidatePath("");
    return {
      message: `Successfully reset ${participant.first_name}!`,
    };
  },
);

export async function getRaces() {
  const races = await _db.races.findMany();

  return races;
}

export const setFinisher = action(FinisherSchema, async (payload) => {
  const races = await _db.races.findMany({
    where: {
      id: {
        in: payload.raceIds,
      },
    },
  });

  const participant = (await _db.participant.findFirst({
    where: {
      event_id: payload.event_id,
      race_number: {
        equals: payload.race_number,
        mode: "insensitive",
      },
    },
  }))!;

  let timeTaken = "";
  try {
    const participantId = participant.id;
    const possibleParticipantRaces = participant.races.filter(
      (i) => i.race_type === "StandardNoLaps",
    );

    for (const race of possibleParticipantRaces) {
      const actualRace = races.find((i) => i.id === race.race_id);
      const batch = actualRace!.batches.find(
        (i) => i.index === race.batch_index,
      )!;

      const alreadyCaptured = batch.participants.some(
        (i) => i.participant_id === participantId && !!i.finish_time,
      );

      if (alreadyCaptured)
        throw new Error("You have already captured that competitor");

      let timeTakenMs = 0;
      if (batch.start_on) {
        timeTaken = getTimerDifference(batch.start_on, payload.finish_time);
        timeTakenMs = differenceInMilliseconds(
          payload.finish_time,
          batch.start_on,
        );
      }

      await _db.races.update({
        data: {
          batches: {
            updateMany: {
              data: {
                participants: {
                  updateMany: {
                    data: {
                      finish_status: payload.finish_status,
                      finish_time: payload.finish_time,
                      time_taken: timeTaken,
                      time_taken_ms: timeTakenMs,
                    },
                    where: {
                      participant_id: participantId,
                    },
                  },
                },
              },
              where: {
                index: +race.batch_index!,
              },
            },
          },
        },
        where: {
          id: race.race_id,
        },
      });
    }
  } catch (e) {
    console.error(e);
    throw new Error((e as any).message);
  }

  revalidatePath("");

  return {
    message: `${participant.first_name} ${participant.last_name} finished in ${timeTaken}!`,
  };
});

export const changeParticipantFinishStatus = action(
  ChangeParticipantFinishStatusSchema,
  async (participantData) => {
    const participant = await _db.participant.findFirst({
      where: {
        id: participantData.participantId,
      },
    });

    if (!participant) throw new Error("Unable to find that participant");

    const races = await _db.races.findMany({
      where: {
        id: {
          in: participant.races.map((i) => i.race_id),
        },
        race_type: "StandardNoLaps",
      },
    });

    for (const race of races) {
      const participantRace = participant.races.find(
        (i) => i.race_id === race.id,
      );
      if (!participantRace) continue;

      await _db.races.update({
        data: {
          batches: {
            updateMany: {
              data: {
                participants: {
                  updateMany: {
                    data: {
                      finish_status: participantData.finish_status,
                      finish_time: participantData.finish_time,
                    },
                    where: {
                      participant_id: participant.id,
                    },
                  },
                },
              },
              where: {
                index: participantRace.batch_index!,
              },
            },
          },
        },
        where: {
          race_type: "StandardNoLaps",
          id: race.id,
        },
      });
    }

    revalidatePath("");
    return {
      message: `${participant.first_name} status changed to ${participantData.finish_status} and time to ${participantData.finish_time}`,
    };
  },
);

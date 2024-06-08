"use server";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import {
  ChangeParticipantFinishStatusSchema,
  DeleteFinisherSchema,
  FinisherSchema,
} from "./schema";
import { participant, participant_batch } from "@prisma/client";
import { z } from "zod";
import { revalidatePath, unstable_noStore } from "next/cache";
import { getTimerDifference } from "@/lib/getTimerDifference";
import { omit, uniq } from "lodash";
import { differenceInMilliseconds, differenceInYears } from "date-fns";

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
      .sort((a, b) => +a.finish_time! - +b.finish_time!);

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

    const newParticipant: participant = {
      ...participant,
      batches: participant.batches.map((i) => {
        if (!race_ids.includes(i.race_id)) return i;

        return {
          ...i,
          finish_time: null,
          finish_status: null,
          time_taken: null,
          time_taken_ms: null,
        };
      }),
    };

    await _db.participant.update({
      data: omit(newParticipant, "id"),
      where: {
        id: participantId,
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
  const participant = await _db.participant.findFirst({
    where: {
      batches: {
        some: {
          race_id: {
            in: payload.raceIds,
          },
        },
      },
      race_number: payload.race_number,
    },
  });

  if (!participant) {
    throw new Error("Cannot find that participant. Time entry not saved.");
  }

  const { batches, finishTime } = await processBatchTimes(
    participant.batches,
    payload,
  );
  const newEntry: typeof participant = {
    ...participant,
    batches,
  };

  try {
    const result = await _db.participant.update({
      data: omit(newEntry, "id"),
      where: {
        id: participant.id,
      },
    });
  } catch (e) {
    const message = "Error updating finisher details";
    console.error(message);
    console.error(e);
    throw new Error(message);
  }

  revalidatePath("");

  return {
    message: `${participant.first_name} ${participant.last_name} finished in ${finishTime}!`,
  };
});

async function processBatchTimes(
  participantBatches: participant_batch[],
  input: z.infer<typeof FinisherSchema>,
) {
  const races = await _db.races.findMany({
    where: {
      id: {
        in: input.raceIds,
      },
    },
  });

  let finishTime = "";
  const result = participantBatches.map((i) => {
    const race = races.find((r) => r.id == i.race_id);
    if (!race) return i;

    const batch = race.batches.find((i) => i.batch_id);
    if (!batch) return i;

    const startOn = batch.start_on;
    if (!startOn) return i;
    const timeTaken = getTimerDifference(startOn, input.finish_time);
    finishTime = timeTaken;

    return {
      ...i,
      finish_time: input.finish_time,
      finish_status: input.finish_status,
      time_taken: timeTaken,
      time_taken_ms: differenceInMilliseconds(
        input.finish_time,
        batch.start_on!,
      ),
    };
  });

  return {
    batches: result,
    finishTime,
  };
}

export const changeParticipantFinishStatus = action(
  ChangeParticipantFinishStatusSchema,
  async (participantData) => {
    const participant = await _db.participant.findFirst({
      where: {
        id: participantData.participantId,
      },
    });

    if (!participant) throw new Error("Unable to find that participant");

    const newParticipant = await _db.participant.update({
      data: {
        ...omit(participant, "id"),
        batches: participant.batches.map((i) => {
          if (!participantData.raceIds.includes(i.race_id)) return i;

          return {
            ...i,
            finish_status: participantData.newFinishStatus,
          };
        }),
      },
      where: {
        id: participantData.participantId,
      },
    });

    revalidatePath("");
    return {
      message: `${participant.first_name} status changed to ${participantData.newFinishStatus}`,
    };
  },
);

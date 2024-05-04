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
import { omit } from "lodash";
import { differenceInMilliseconds } from "date-fns";

export async function getFinishers(raceIds: string[]) {
  unstable_noStore();
  const rawParticipants = await _db.participant.findMany({
    where: {
      batches: {
        some: {
          race_id: {
            in: raceIds,
          },
          finish_time: {
            not: null,
          },
        },
      },
    },
  });

  const races = await _db.races.findMany({
    where: {
      id: {
        in: raceIds,
      },
    },
  });

  const participants = rawParticipants.map((i) => {
    return {
      ...i,
      batches: i.batches.map((b) => {
        const race = races.find(
          (r) =>
            r.batches.some((rb) => rb.batch_id === b.batch_id) &&
            r.id === b.race_id,
        );
        const batch = race?.batches.find((i) => i.batch_id === b.batch_id);

        return {
          finish_status: b.finish_status,
          race_id: b.race_id,
          batch_id: b.batch_id,
          race_name: race?.name,
          batch_start_on: batch?.start_on,
          batch: batch?.name,
          finish_time: b.finish_time,
          time_taken: b.time_taken,
          time_taken_ms: b.time_taken_ms,
        };
      }),
    };
  });

  return participants;
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

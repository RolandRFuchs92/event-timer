"use server";

import { _db } from "@/lib/db";

export async function getFinishers(raceIds: string[]) {
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
          race_name: race?.name,
          batch_start_on: batch?.start_on,
          batch: batch?.name,
          finish_time: b.finish_time,
        };
      }),
    };
  });

  return participants;
}

export async function deleteFinisher(participantId: string) {}

export async function getRaces() {
  const races = await _db.races.findMany();

  return races;
}

type setFinisherParams = {
  race_number: string;
  finish_status: string;
  race_ids: string[];
  event_id: string;
};

export async function setFinisher(payload: setFinisherParams) {
  console.log(payload);
}

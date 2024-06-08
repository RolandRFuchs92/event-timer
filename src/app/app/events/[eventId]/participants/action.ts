"use server";

import { _db } from "@/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import { mapRacesAndBatches } from "./mappers";

export async function deleteParticipant(participantId: string) {
  const participantResult = await _db.participant.delete({
    where: {
      id: participantId,
    },
  });

  revalidatePath("");

  return {
    result: participantResult,
    message: `Successfully deleted ${participantResult.first_name} ${participantResult.last_name}`,
  };
}

export async function getParticipants(eventId: string) {
  unstable_noStore();
  const participants = await _db.participant.findMany({
    where: {
      event_id: eventId,
    },
  });

  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  const result = participants.map((i) => {
    const batches = mapRacesAndBatches(i.id, races);

    return {
      ...i,
      batches,
    };
  });

  return result;
}

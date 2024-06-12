'use server';

import { action } from "@/lib/safeAction";
import { GetBatchParticipantSchema } from "./schema";
import { getRace } from "@/app/app/events/[eventId]/action";
import { _db } from "@/lib/db";
import { unstable_noStore } from "next/cache";

export const getBatchParticipants = action(GetBatchParticipantSchema, async (input) => {
  unstable_noStore();
  const race = await getRace(input.race_id);
  const batch = race.batches[input.batch_index];

  const rawParticipants = await _db.participant.findMany({
    where: {
      id: {
        in: batch.participants.map(i => i.participant_id)
      }
    }
  });

  if (!batch)
    throw new Error("Cannot find that batch!")

  const result = {
    ...batch,
    participants: rawParticipants
  }

  return {
    result
  }
})

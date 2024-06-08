"use server";

import { revalidatePath, unstable_noStore } from "next/cache";

import { MONGO_UPSERT_HACK, _db } from "@/lib/db";
import { action } from "@/lib/safeAction";

import { DefaultRegistration, RegistrationSchema } from "./schema";
import { createNewParticipant, updateParticipant } from "./participantAction";

export const mutateParticipant = action(RegistrationSchema, async (input) => {
  const isNewParticipant = input.id === "";

  if (isNewParticipant) {
    const result = await createNewParticipant(input);
    revalidatePath(`/app/events/${input.event_id}/participants`);

    return {
      result,
      message: "Successfully created new participant",
    };
  }

  const result = await updateParticipant(input);
  revalidatePath(`/app/events/${input.event_id}/participants`);

  return {
    result,
    message: "Registration was successful.",
  };
});

export async function getEventRaces(eventId: string) {
  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  return races;
}

export async function getParticipant(eventId: string, participantId: string) {
  if (participantId === MONGO_UPSERT_HACK) return DefaultRegistration;

  unstable_noStore();
  const result = await _db.participant.findFirst({
    where: {
      event_id: eventId,
      id: participantId,
    },
  });

  if (!result) return DefaultRegistration;
  return result;
}

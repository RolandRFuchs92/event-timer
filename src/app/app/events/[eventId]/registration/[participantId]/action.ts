"use server";
import { MONGO_UPSERT_HACK, _db } from "@/lib/db";
import { DefaultRegistration, RegistrationSchema } from "./schema";
import { z } from "zod";
import { participant } from "@prisma/client";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function mutateParticipant(
  eventId: string,
  { id, ...participant }: z.infer<typeof RegistrationSchema>,
) {
  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  const newParticipant: Omit<participant, "id"> = {
    ...participant,
    event_id: eventId,
    batches: participant.batches
      .filter((i) => {
        const race = races.find((r) => i.race_id === r.id);
        if (!race) return false;

        const batch = race.batches.find((b) => b.batch_id === i.batch_id);
        return !!batch;
      })
      .map((i) => {
        const race = races.find((r) => r.id === i.race_id)!;
        const race_name = race.name;
        const batch_name = race.batches.find(
          (b) => b.batch_id === i.batch_id,
        )!.name;

        return {
          ...i,
          time_taken: null,
          finish_time: null,
          race_name,
          batch_name,
          time_taken_ms: null,
          finish_status: null,
        };
      }),
  };

  const result = await _db.participant.upsert({
    update: newParticipant,
    create: newParticipant,
    where: {
      id,
    },
  });

  revalidatePath(`/app/events/${eventId}/participants`);

  return {
    result,
    message: "Registration was successful.",
  };
}

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

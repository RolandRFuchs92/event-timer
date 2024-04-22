"use server";
import { _db } from "@/lib/db";
import { RegistrationSchema } from "./schema";
import { z } from "zod";
import { participant } from "@prisma/client";

export async function mutateParticipant(
  eventId: string,
  { id, ...participant }: z.infer<typeof RegistrationSchema>,
) {
  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });
  console.log(participant);

  const newParticipant: Omit<participant, "id"> = {
    ...participant,
    batches: participant.batches.map((i) => {
      const race = races.find((r) => r.id === i.race_id)!;
      const race_name = race.name;
      const batch_name = race.batches.find(
        (b) => b.batch_id === i.batch_id,
      )!.name;

      return {
        ...i,
        race_name,
        batch_name,
      };
    }),
  };

  console.log(newParticipant);
  const result = await _db.participant.upsert({
    update: newParticipant,
    create: newParticipant,
    where: {
      id,
    },
  });

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

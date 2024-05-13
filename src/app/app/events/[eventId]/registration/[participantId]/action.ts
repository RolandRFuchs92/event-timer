"use server";
import { MONGO_UPSERT_HACK, _db } from "@/lib/db";
import { DefaultRegistration, RegistrationSchema } from "./schema";
import { z } from "zod";
import { participant } from "@prisma/client";
import { revalidatePath, unstable_noStore } from "next/cache";
import { omit, uniq } from "lodash";

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
    races: participant.batches
      .filter((i) => {
        const race = races.find((r) => i.race_id === r.id);
        return !race || race.race_type === "LaneRace";
      })
      .map((i) => {
        const race = races.find((r) => i.race_id === r.id)!;

        return {
          race_type: race.race_type,
          race_id: race.id,
          race_name: race.name,
        };
      }),
    batches: participant.batches
      .filter((i) => {
        const race = races.find((r) => i.race_id === r.id);
        if (!race || race.race_type === "LaneRace") return false;

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

  const laneRaces = races.filter((i) => i.race_type === "LaneRace");
  await _db.$transaction(
    laneRaces.map((i) => {
      i.heat_containers[0].all_participant_ids = uniq([...i.heat_containers[0].all_participant_ids, id])

      return _db.races.update({
        data: {
          ...omit(i, "id"),
          heat_containers: i.heat_containers,
        },
        where: {
          id: i.id,
        },
      });
    }),
  );

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

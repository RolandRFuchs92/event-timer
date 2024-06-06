"use server";

import { participant } from "@prisma/client";
import { revalidatePath, unstable_noStore } from "next/cache";

import { MONGO_UPSERT_HACK, _db } from "@/lib/db";
import { action } from "@/lib/safeAction";

import { DefaultRegistration, RegistrationSchema } from "./schema";

export const mutateParticipant = action(RegistrationSchema, async (input) => {
  const referencedRaces = await _db.races.findMany({
    where: {
      id: {
        in: input.batches.map((i) => i.race_id),
      },
    },
  });

  const newParticipant: Omit<participant, "id"> = {
    birthdate: input.birthdate,
    event_id: input.event_id,
    is_male: input.is_male,
    last_name: input.last_name,
    first_name: input.first_name,
    race_number: input.race_number, // TO BE AUTO GENERATED!!!
    races: input.batches.map((i) => {
      const thisRace = referencedRaces.find((rr) => rr.id === i.race_id)!;

      return {
        race_id: i.race_id,
        race_name: thisRace.name,
        race_type: thisRace.race_type,
        batch_index: +i.batch_index || null,
      };
    }),
  };

  const result = await _db.participant.upsert({
    update: newParticipant,
    create: newParticipant,
    where: {
      id: input.id,
    },
  });


  //// NEED TO THEN CHECN INPUT AND APPLY CORRECT VALUES PER INPUT ESP BATCHES
  for (const race of referencedRaces) {
    const isLaneRace = race.race_type === "LaneRace";

    if (isLaneRace && race.rounds[0].all_participant_ids.includes(result.id))
      continue;

    const batchParticipants = race.batches.flatMap(i => i.participants.map(i => i.participant_id))
    if (!isLaneRace && batchParticipants.includes(result.id)) {
      continue;
    }

    if (isLaneRace) {
      await _db.races.update({
        data: {
          rounds: {
            updateMany: {
              data: {
                all_participant_ids: {
                  push: result.id
                }
              },
              where: {
                round_index: 0
              }
            }
          }
        },
        where: {
          id: race.id
        }
      });
      continue;
    }

    await _db.races.update({
      data: {
        batches: {
          updateMany: {
            data: {
              participants: {
                push: {
                  participant_id: result.id,
                }
              }
            },
            where: {
              index: 1
            }
          }
        }
      },
      where: {
        id: race.id
      }
    });
  }

  const standardRaces = referencedRaces.filter((i) => i.race_type === "StandardNoLaps");

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

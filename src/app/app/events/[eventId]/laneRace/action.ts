'use server'

import { action } from "@/lib/safeAction";
import { LaneRaceSchema, NewHeatSchema } from "./schema";
import { _db } from "@/lib/db";
import { max, omit } from "lodash";
import { revalidatePath } from "next/cache";

export const assignCompetitors = action(LaneRaceSchema, async () => { });

export const getQualifierCompetitors = action(
  LaneRaceSchema,
  async ({ raceId }) => {
    const competitors = await _db.participant.findMany({
      where: {
        races: {
          some: {
            race_id: raceId,
          },
        },
      },
    });

    return competitors;
  },
);

export const getLaneRace = action(LaneRaceSchema, async ({ raceId }) => {
  const race = await _db.races.findFirst({
    where: {
      id: raceId
    }
  });


  if (!race)
    throw new Error("Unable to find that race!");

  const participants = await _db.participant.findMany({
    where: {
      id: {
        in: race.heat_containers[0].all_participant_ids.map(i => i)
      }
    }
  });

  const finalRace = {
    ...omit(race, "batches"),
    heat_containers: race.heat_containers.map(({ all_participant_ids, ...i }) => {
      return {
        ...i,
        all_participants: participants.filter(i => all_participant_ids.some(ap => ap === i.id)).map(({ batches, races, ...p }) => {
          return p
        })
      }
    })
  }

  return finalRace
})

export const createNewHeat = action(NewHeatSchema, async (data) => {
  const race = await _db.races.findFirst({
    where: {
      id: data.race_id
    }
  });

  if (!race)
    throw new Error("Unable to find that race.");

  const newRace = await _db.races.update({
    data: {
      ...omit(race, 'id'),
      heat_containers: [
        ...race.heat_containers,
        {
          name: data.name,
          max_heats: data.max_heats,
          is_qualifier: false,
          heats: [],
          is_closed: false,
          all_participant_ids: [],
          heat_index: (max(race.heat_containers.map(i => i.heat_index)) ?? 0) + 1
        }
      ]
    },
    where: {
      id: data.race_id
    }
  });
  revalidatePath("");

  return {
    result: newRace,
    message: "Successfully created a new heat."
  }
})


export const deleteHeat = action();

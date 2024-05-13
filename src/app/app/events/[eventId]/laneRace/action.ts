'use server'

import { action } from "@/lib/safeAction";
import { DeleteHeatSchema, LaneRaceSchema, NewHeatSchema, NewRoundSchema } from "./schema";
import { _db } from "@/lib/db";
import { max, omit } from "lodash";
import { revalidatePath, unstable_noStore } from "next/cache";

export const assignCompetitors = action(LaneRaceSchema, async () => { });

export const getQualifierCompetitors = action(
  LaneRaceSchema,
  async ({ raceId }) => {
    unstable_noStore();
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
  unstable_noStore();
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

export const createNewRound = action(NewRoundSchema, async (data) => {
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


export const deleteHeat = action(DeleteHeatSchema, async ({ heat_index, race_id }) => {
  if (heat_index === 0)
    throw new Error("You may not delete the qualifier heat. Please rather delete the entire race.");

  const race = await _db.races.findFirst({
    where: {
      id: race_id
    }
  });

  if (!race)
    throw new Error("Unable to find that race.");

  let heatName = "";
  const newRace = {
    ...omit(race, 'id'),
    heat_containers: race.heat_containers.filter(i => {
      if (i.heat_index === heat_index) {
        heatName = i.name;
        return false;
      }
      return true;
    })
  }

  await _db.races.update({
    data: newRace,
    where: {
      id: race_id
    }
  });

  revalidatePath("");
  return {
    message: `Successfully removed heat ${heatName}`
  }
});

export const createNewHeat = action(NewHeatSchema, async ({ race_id, heat_index }) => {
  const race = await _db.races.findFirst({
    where: {
      id: race_id
    }
  });

  if (!race)
    throw new Error("Unable to find that race!");

  const round = race?.heat_containers[heat_index];
  if (!round)
    throw new Error("unable to find that round!");

  round.heats.push({
    index: round.heats.length,
    participants: [],
    is_closed: false,
    start_time: null
  });

  await _db.races.update({
    data: omit(race, 'id'),
    where: {
      id: race_id
    }
  });


  revalidatePath("");

  return {
    message: "New heat has been created!"
  }
});

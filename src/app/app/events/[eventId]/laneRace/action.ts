"use server";

import { action } from "@/lib/safeAction";
import {
  DeleteHeatSchema,
  LaneCloseSchema,
  LaneCompetitorHeatSchema,
  LaneCompetitorSchema,
  LaneRaceSchema,
  NewHeatSchema,
  NewRoundSchema,
} from "./schema";
import { _db } from "@/lib/db";
import { max, omit, uniqBy } from "lodash";
import { revalidatePath, unstable_noStore } from "next/cache";

export const assignCompetitors = action(LaneRaceSchema, async () => {});

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
      id: raceId,
    },
  });

  if (!race) throw new Error("Unable to find that race!");

  const participants = await _db.participant.findMany({
    where: {
      id: {
        in: race.heat_containers[0].all_participant_ids.map((i) => i),
      },
    },
  });

  const finalRace = {
    ...omit(race, "batches"),
    heat_containers: race.heat_containers.map(
      ({ all_participant_ids, ...i }) => {
        return {
          ...i,
          all_participants: participants
            .filter((i) => all_participant_ids.some((ap) => ap === i.id))
            .map(({ batches, races, ...p }) => {
              return p;
            }),
        };
      },
    ),
  };

  return finalRace;
});

export const createNewRound = action(NewRoundSchema, async (data) => {
  const race = await _db.races.findFirst({
    where: {
      id: data.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const newRace = await _db.races.update({
    data: {
      ...omit(race, "id"),
      heat_containers: [
        ...race.heat_containers,
        {
          name: data.name,
          max_heats: data.max_heats,
          is_qualifier: false,
          heats: [],
          is_closed: false,
          all_participant_ids: [],
          heat_index:
            (max(race.heat_containers.map((i) => i.heat_index)) ?? 0) + 1,
        },
      ],
    },
    where: {
      id: data.race_id,
    },
  });
  revalidatePath("");

  return {
    result: newRace,
    message: "Successfully created a new heat.",
  };
});

export const deleteRound = action(
  DeleteHeatSchema,
  async ({ heat_index, race_id }) => {
    if (heat_index === 0)
      throw new Error(
        "You may not delete the qualifier heat. Please rather delete the entire race.",
      );

    const race = await _db.races.findFirst({
      where: {
        id: race_id,
      },
    });

    if (!race) throw new Error("Unable to find that race.");

    let heatName = "";
    const newRace = {
      ...omit(race, "id"),
      heat_containers: race.heat_containers.filter((i) => {
        if (i.heat_index === heat_index) {
          heatName = i.name;
          return false;
        }
        return true;
      }),
    };

    await _db.races.update({
      data: newRace,
      where: {
        id: race_id,
      },
    });

    revalidatePath("");
    return {
      message: `Successfully removed heat ${heatName}`,
    };
  },
);

export const createNewHeat = action(
  NewHeatSchema,
  async ({ race_id, heat_index }) => {
    const race = await _db.races.findFirst({
      where: {
        id: race_id,
      },
    });

    if (!race) throw new Error("Unable to find that race!");

    const round = race?.heat_containers[heat_index];
    if (!round) throw new Error("unable to find that round!");

    round.heats.push({
      index: round.heats.length,
      participants: [],
      is_closed: false,
      start_time: null,
    });

    await _db.races.update({
      data: omit(race, "id"),
      where: {
        id: race_id,
      },
    });

    revalidatePath("");

    return {
      message: "New heat has been created!",
    };
  },
);

export const addLaneCompetitor = action(LaneCompetitorSchema, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const roundRef = race.heat_containers[input.round_index];
  const heatRef = roundRef.heats[input.heat_index];

  if (heatRef.is_closed)
    throw new Error("Cannot change participants of a heat when its closed.");

  const participantsInHeats = roundRef.heats.flatMap((h) =>
    h.participants.map((p) => {
      return {
        participant_id: p.participant_id,
        heat_index: h.index,
      };
    }),
  );

  const existingHeatParticipant = participantsInHeats.find(
    (i) => i.participant_id === input.participant_id,
  );

  if (!!existingHeatParticipant)
    throw new Error(
      `That participant is already in a heat ${existingHeatParticipant.heat_index + 1}!`,
    );

  const participant = await _db.participant.findFirst({
    where: {
      id: input.participant_id,
    },
  });

  if (!participant) throw new Error("Unable to find that participant.");

  const participants = [...heatRef.participants];

  participants.unshift({
    participant_id: input.participant_id,
    is_winner: false,
    name: `${participant.first_name} ${participant.last_name} [${participant.race_number}]`,
    index: 0,
    end_time: null,
    total_time_ms: null,
  });

  heatRef.participants = uniqBy(participants, (i) => i.participant_id).slice(
    0,
    2,
  );
  const result = await _db.races.update({
    data: omit(race, "id"),
    where: {
      id: race.id,
    },
  });

  revalidatePath("");
  return {
    result,
    message: "Successfully added new participant",
  };
});

export const startLaneRace = action(LaneCompetitorHeatSchema, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const round = race.heat_containers[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const heat = round.heats[input.heat_index];
  heat.start_time = input.start_date;
  if (!input.start_date) {
    heat.is_closed = false;
  }

  const raceResult = await _db.races.update({
    data: omit(race, "id"),
    where: {
      id: input.race_id,
    },
  });

  revalidatePath("");

  return {
    message: input.start_date === null ? "Race reset" : `Race started!`,
  };
});

export const closeLaneRace = action(LaneCloseSchema, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const round = race.heat_containers[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const heat = round.heats[input.heat_index];
  heat.is_closed = true;

  const result = await _db.races.update({
    data: omit(race, "id"),
    where: {
      id: input.race_id,
    },
  });

  revalidatePath("");
  return {
    result,
    message: `Successfully closed heat ${input.heat_index + 1}`,
  };
});

export const deleteHeat = action(LaneCloseSchema, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const round = race.heat_containers[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const [_] = round.heats.splice(input.heat_index, 1);

  const result = await _db.races.update({
    data: omit(race, "id"),
    where: {
      id: input.race_id,
    },
  });

  revalidatePath("");
  return {
    result,
    message: "Successfully deleted that heat.",
  };
});

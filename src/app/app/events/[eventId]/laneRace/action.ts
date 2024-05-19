"use server";

import { differenceInMilliseconds } from "date-fns";
import { revalidatePath, unstable_noStore } from "next/cache";
import { max, omit, uniqBy } from "lodash";
import { ParticipantHeatStatusEnum } from "@prisma/client";

import { action } from "@/lib/safeAction";
import { _db } from "@/lib/db";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";

import {
  DeleteHeatSchema,
  FinishLaneRaceSchema,
  HeatParticipantSchema,
  LaneCloseSchema,
  LaneCompetitorHeatSchema,
  LaneCompetitorSchema,
  LaneRaceSchema,
  NewHeatSchema,
  NewRoundSchema,
} from "./schema";

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
    const rounds = race.heat_containers
      .filter((i) => {
        if (i.heat_index === heat_index) {
          heatName = i.name;
          return false;
        }
        return true;
      })
      .map((data, index) => {
        return {
          ...data,
          heat_index: index,
        };
      });

    await _db.races.update({
      data: {
        heat_containers: rounds,
      },
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
      data: {
        heat_containers: {
          updateMany: {
            data: {
              heats: round.heats
            },
            where: {
              heat_index: heat_index
            }
          }
        }
      },
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
    status: ParticipantHeatStatusEnum.NotStarted,
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
    data: {
      heat_containers: {
        updateMany: {
          where: {
            heat_index: input.round_index
          },
          data: {
            heats: {
              updateMany: {
                data: {
                  participants: heatRef.participants
                },
                where: {
                  index: input.heat_index
                }
              }
            }
          }
        }
      }
    },
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
  const newParticipants = heat.participants.map((i) => ({
    ...i,
    status: null,
    end_time: null,
    total_time_ms: null,
  }));

  const raceResult = await _db.races.update({
    data: {
      heat_containers: {
        updateMany: {
          data: {
            heats: {
              updateMany: {
                data: {
                  is_closed: false,
                  start_time: input.start_date,
                  participants: newParticipants,
                },
                where: {
                  index: input.heat_index,
                },
              },
            },
          },
          where: {
            heat_index: input.round_index,
          },
        },
      },
    },
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
  console.log(input);

  if (!race) throw new Error("Unable to find that race.");

  const round = race.heat_containers[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const result = await _db.races.update({
    data: {
      heat_containers: {
        updateMany: {
          data: {
            heats: round.heats
              .filter((i) => i.index !== input.heat_index)
              .map((i, heatIndex) => ({
                ...i,
                index: heatIndex,
              })),
          },
          where: {
            heat_index: input.round_index,
          },
        },
      },
    },
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

export const finishLaneRace = action(FinishLaneRaceSchema, async (input) => {
  const currentRace = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!currentRace) throw new Error("Unable to find that race.");

  const heat =
    currentRace.heat_containers[input.round_index].heats[input.heat_index];

  const thisParticipantData = heat.participants.find(
    (i) => i.participant_id === input.participant_id,
  );

  let timeTakenMs = 0;
  if (heat.start_time) {
    timeTakenMs = differenceInMilliseconds(input.finish_date, heat.start_time);
  }
  if (!thisParticipantData)
    throw new Error("Unable to find that participant for that heat.");

  if (thisParticipantData.status !== null) {
    return {
      message: "A time was already captured for this competitor.",
    };
  }

  const competitorData = heat.participants.find(
    (i) => i.participant_id !== input.participant_id,
  );

  let participantStatusEnum: ParticipantHeatStatusEnum | null = null;
  if (competitorData?.total_time_ms === null) {
    participantStatusEnum = ParticipantHeatStatusEnum.Winner;
  } else {
    participantStatusEnum =
      timeTakenMs < +(competitorData?.total_time_ms ?? 0)
        ? ParticipantHeatStatusEnum.Winner
        : ParticipantHeatStatusEnum.RunnerUp;
  }

  const thisCompetitorStuff = await _db.races.update({
    data: {
      heat_containers: {
        updateMany: {
          data: {
            heats: {
              updateMany: {
                data: {
                  is_closed: competitorData?.status !== null,
                  participants: {
                    updateMany: {
                      data: {
                        end_time: input.finish_date,
                        total_time_ms: timeTakenMs.toString(),
                        status: participantStatusEnum,
                      },
                      where: {
                        participant_id: input.participant_id,
                      },
                    },
                  },
                },
                where: {
                  index: input.heat_index,
                },
              },
            },
          },
          where: {
            heat_index: input.round_index,
          },
        },
      },
    },
    where: {
      id: input.race_id,
    },
  });

  revalidatePath("");
  const message =
    heat.start_time === null
      ? `Race finishing time logged, but the heat was not started.`
      : `Racer finishing time was ${millisecondsToHumanFormat(timeTakenMs)}`;

  return {
    message: message,
  };
});

export const editHeatParticipant = action(
  HeatParticipantSchema,
  async (input) => {
    const currentRace = await _db.races.findFirst({
      where: {
        id: input.race_id,
      },
    });

    if (!currentRace) throw new Error("Unable to find that race.");

    const heat =
      currentRace.heat_containers[input.round_index].heats[input.heat_index];

    const thisParticipantData = heat.participants.find(
      (i) => i.participant_id === input.participant_id,
    );

    const endTime = new Date(`${new Date().toDateString()} ${input.end_time}`);
    let timeTakenMs = 0;
    if (heat.start_time) {
      timeTakenMs = differenceInMilliseconds(endTime!, heat.start_time);
    }

    const thisCompetitorStuff = await _db.races.update({
      data: {
        heat_containers: {
          updateMany: {
            data: {
              heats: {
                updateMany: {
                  data: {
                    participants: {
                      updateMany: {
                        data: {
                          end_time: endTime,
                          total_time_ms: timeTakenMs.toString(),
                          status: input.status,
                        },
                        where: {
                          participant_id: input.participant_id,
                        },
                      },
                    },
                  },
                  where: {
                    index: input.heat_index,
                  },
                },
              },
            },
            where: {
              heat_index: input.round_index,
            },
          },
        },
      },
      where: {
        id: input.race_id,
      },
    });

    revalidatePath("");

    return {
      message: "Successfully updated that participant!",
    };
  },
);

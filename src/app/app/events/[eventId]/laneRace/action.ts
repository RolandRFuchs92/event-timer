"use server";

import { differenceInMilliseconds } from "date-fns";
import { revalidatePath, unstable_noStore } from "next/cache";
import { max, omit } from "lodash";
import { ParticipantHeatStatusEnum, heat, round } from "@prisma/client";

import { action } from "@/lib/safeAction";
import { _db } from "@/lib/db";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";

import {
  DeleteRoundSchema,
  FinishLaneRaceSchema,
  HeatParticipantSchema,
  LaneCloseSchema,
  LaneCompetitorHeatSchema,
  LaneCompetitorSchema,
  LaneRaceSchema,
  MoveWinersSchema,
  NewHeatSchema,
  NewRoundSchema,
  RemoveCompetitorSchema,
} from "./schema";
import {
  deleteRoundCommand,
  updateParticipantTimeCommand,
} from "./mongoCommands";

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
        in: race.rounds[0].all_participant_ids.map((i) => i),
      },
    },
  });

  const finalRace = {
    ...omit(race, "batches"),
    rounds: race.rounds.map(({ all_participant_ids, ...i }) => {
      return {
        ...i,
        all_participants: participants
          .filter((i) => all_participant_ids.some((ap) => ap === i.id))
          .map(({ batches, races, ...p }) => {
            return p;
          }),
      };
    }),
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

  const newRound: round = {
    name: data.name,
    is_qualifier: false,
    heats: [],
    all_participant_ids: [],
    round_index: (max(race.rounds.map((i) => i.round_index)) ?? 0) + 1,
  };

  const newRace = await _db.races.update({
    data: {
      rounds: {
        push: newRound,
      },
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
  DeleteRoundSchema,
  async ({ round_index, race_id }) => {
    if (round_index === 0)
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
    let newIndex = -1;
    var oldIndexMaps: Parameters<typeof deleteRoundCommand>[0]["oldIndexMaps"] =
      race.rounds.map((i, index) => {
        let isOldPosition = i.round_index === round_index;
        if (!isOldPosition) newIndex++;

        return {
          indexPosition: index,
          newPropertyIndex: isOldPosition ? -1 : newIndex,
        };
      });

    await deleteRoundCommand({
      oldIndexMaps: oldIndexMaps.filter((i) => i.newPropertyIndex > -1),
      roundIndexToRemove: round_index,
      raceId: race_id,
    });

    revalidatePath("");
    return {
      message: `Successfully removed heat ${heatName}`,
    };
  },
);

export const createNewHeat = action(
  NewHeatSchema,
  async ({ race_id, round_index }) => {
    const race = await _db.races.findFirst({
      where: {
        id: race_id,
      },
    });

    if (!race) throw new Error("Unable to find that race!");

    const round = race?.rounds[round_index];
    if (!round) throw new Error("unable to find that round!");

    const newHeat: heat = {
      index: round.heats.length,
      participants: [],
      is_closed: false,
      start_time: null,
    };

    await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              heats: {
                push: newHeat,
              },
            },
            where: {
              round_index: round_index,
            },
          },
        },
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

  const roundRef = race.rounds[input.round_index];
  const heatRef = roundRef.heats[input.heat_index];

  if (heatRef.is_closed)
    throw new Error("Cannot change participants of a heat when its closed.");

  if (
    heatRef.participants.some((i) => i.participant_id === input.participant_id)
  )
    throw new Error(`That user is already part of heat ${heatRef.index + 1}`);

  if (heatRef.participants.length === 2)
    throw new Error(
      `Please remove a participant from heat ${heatRef.index + 1} first.`,
    );

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

  const newParticipant = {
    participant_id: input.participant_id,
    status: ParticipantHeatStatusEnum.NotStarted,
    name: `${participant.first_name} ${participant.last_name} [${participant.race_number}]`,
    index: 0,
    end_time: null,
    total_time_ms: null,
  };

  const result = await _db.races.update({
    data: {
      rounds: {
        updateMany: {
          where: {
            round_index: input.round_index,
          },
          data: {
            heats: {
              updateMany: {
                data: {
                  participants: {
                    push: newParticipant,
                  },
                },
                where: {
                  index: input.heat_index,
                },
              },
            },
          },
        },
      },
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

  const round = race.rounds[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const heat = round.heats[input.heat_index];
  const newParticipants = heat.participants.map((i) => ({
    ...i,
    status: null,
    end_time: null,
    total_time_ms: null,
  }));

  await _db.races.update({
    data: {
      rounds: {
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
            round_index: input.round_index,
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

  const round = race.rounds[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const result = await _db.races.update({
    data: {
      rounds: {
        updateMany: {
          data: {
            heats: {
              updateMany: {
                data: {
                  is_closed: true,
                },
                where: {
                  index: input.heat_index,
                },
              },
            },
          },
          where: {
            round_index: input.round_index,
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

  const round = race.rounds[input.round_index];
  if (!round) throw new Error("Unable to find that round.");

  const result = await _db.races.update({
    data: {
      rounds: {
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
            round_index: input.round_index,
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

  const heat = currentRace.rounds[input.round_index].heats[input.heat_index];

  const thisParticipantIndex = heat.participants.findIndex(
    (i) => i.participant_id === input.participant_id,
  );

  const thisParticipantData = heat.participants[thisParticipantIndex];

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
  if (!competitorData || competitorData?.total_time_ms === null) {
    participantStatusEnum = ParticipantHeatStatusEnum.Winner;
  } else {
    participantStatusEnum =
      timeTakenMs < +(competitorData?.total_time_ms ?? 0)
        ? ParticipantHeatStatusEnum.Winner
        : ParticipantHeatStatusEnum.RunnerUp;
  }

  await updateParticipantTimeCommand({
    raceId: input.race_id,
    roundIndex: input.round_index,
    heatIndex: input.heat_index,
    participantIndex: thisParticipantIndex,
    finishTime: input.finish_date,
    status: participantStatusEnum,
    timeMs: timeTakenMs.toString(),
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

    const heat = currentRace.rounds[input.round_index].heats[input.heat_index];

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
        rounds: {
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
              round_index: input.round_index,
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

export const getWinnersFrom = action(MoveWinersSchema, async (input) => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id,
    },
  });

  if (!race) throw new Error("Unable to find that race.");

  const previousRound = race.rounds.find(
    (i) => i.round_index === input.round_index - 1,
  );
  const thisRound = race.rounds.find(
    (i) => i.round_index === input.round_index,
  );

  if (!previousRound || !thisRound)
    throw new Error("Unalbe to find rounds required for winner transfer");

  const previousWinners = previousRound.heats
    .flatMap((i) => i.participants)
    .filter((i) => i.status === ParticipantHeatStatusEnum.Winner);

  const currentParticipants = thisRound.heats.flatMap((i) => i.participants);

  let newParticipantCount = 0;
  for (const winner of previousWinners) {
    if (
      currentParticipants.some(
        (i) => i.participant_id === winner.participant_id,
      )
    )
      continue;

    newParticipantCount = newParticipantCount + 1;
    currentParticipants.push(winner);
  }

  const result = await _db.races.update({
    data: {
      rounds: {
        updateMany: {
          data: {
            all_participant_ids: currentParticipants.map(
              (i) => i.participant_id,
            ),
          },
          where: {
            round_index: input.round_index,
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
    message: `Successfully moved ${newParticipantCount} participants to ${thisRound.name}`,
  };
});

export const removeCompetitorFromPool = action(
  RemoveCompetitorSchema,
  async (input) => {
    const race = await _db.races.findFirst({
      where: {
        id: input.race_id,
      },
    });

    if (!race) throw new Error("Unable to find that race.");

    const round = race.rounds[input.round_index];

    if (!round) throw new Error("Unable to find that round.");

    const newParticipantIds = round.all_participant_ids.filter(
      (i) => i !== input.participant_id,
    );

    /// Needs to be changed out so that multiple people can work on this at a time
    await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              all_participant_ids: newParticipantIds,
            },
            where: {
              round_index: input.round_index,
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
      message: "Successfully removed that competitor",
    };
  },
);




"use server";
import { RaceTypeEnum, races } from "@prisma/client";

import ordinal from "ordinal";
import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";

import { FinisherFilterSchema } from "./schema";
import { uniqBy } from "lodash";

export const getQualifierLaneRaceResults = action(
  FinisherFilterSchema,
  async (input) => {
    const qualifierLaneRaceResults = await _db.races.findFirst({
      where: {
        id: input.raceId,
      },
    });

    const qualifiers = qualifierLaneRaceResults?.rounds.filter(
      (i) => i.is_qualifier,
    );
    const participants = qualifiers!
      .flatMap((q) =>
        q.heats.flatMap((h) => h.participants.filter((i) => !!i.total_time_ms)),
      )
      .sort((a, b) => +a.total_time_ms! - +b.total_time_ms!)
      .map((i, index) => ({
        ...i,
        position: ordinal(index + 1),
        total_time_pretty: millisecondsToHumanFormat(+i.total_time_ms!),
      }));

    return uniqBy(participants, "participant_id");
  },
);

export const getStandardRaceResults = action(
  FinisherFilterSchema,
  async (input) => {
    const race = await _db.races.findFirst({
      where: {
        id: input.raceId,
      },
    });

    const batchParticipants =
      race?.batches
        .flatMap((b) =>
          b.participants
            .map((p) => ({
              ...p,
              batch: b.name,
            }))
            .filter((i) => !!i.time_taken_ms),
        )
        .sort((a, b) => a.time_taken_ms! - b.time_taken_ms!) ?? [];

    const rawParticipants = await _db.participant.findMany({
      where: {
        id: {
          in: batchParticipants.map((i) => i.participant_id),
        },
      },
    });

    const participants = batchParticipants.map((bp, index) => {
      const me = rawParticipants.find((rp) => rp.id === bp.participant_id);

      return {
        ...bp,
        position: ordinal(index + 1),
        name: me
          ? `${me.first_name} ${me.last_name}[${me.race_number}]`
          : "Unknown",
      };
    });

    return participants;
  },
);

export const getLaneRaceResults = action(
  FinisherFilterSchema,
  async (input) => {
    const laneRaces = await _db.races.findMany({
      where: {
        id: input.raceId,
        race_type: RaceTypeEnum.LaneRace,
      },
    });

    const laneResults = laneRaces.reduce(
      (accum, curr) => {
        const rounds = mapLaneRaceToResults(curr);

        accum.push(rounds);
        return accum;
      },
      [] as ReturnType<typeof mapLaneRaceToResults>[],
    );

    return laneResults;
  },
);

function mapLaneRaceToResults(race: races) {
  const rounds = race.rounds.map((r) => {
    const heats = r.heats
      .filter((i) => i.is_closed)
      .map((h) => {
        return {
          heatNumber: h.index + 1,
          isClosed: h.is_closed,
          participants: h.participants.map((p) => {
            return {
              name: p.name,
              status: p.status,
              timeTakenMs: p.total_time_ms,
              timeTaken: p.total_time_ms
                ? millisecondsToHumanFormat(+p.total_time_ms)
                : null,
            };
          }),
        };
      });

    return {
      roundName: r.name,
      isQualifier: r.is_qualifier,
      heats,
    };
  });

  return rounds;
}

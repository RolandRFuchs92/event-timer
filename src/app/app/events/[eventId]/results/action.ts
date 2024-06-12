"use server";

import {
  ParticipantHeatStatusEnum,
  RaceTypeEnum,
  heat_participant,
  races,
} from "@prisma/client";

import ordinal from "ordinal";
import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";

import { FinisherFilterSchema } from "./schema";
import { groupBy } from "lodash";

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

    const rawParticipants = qualifiers!.flatMap((q) => {
      const results = q.heats.flatMap((h) =>
        h.participants.filter((i) => !!i.total_time_ms),
      );

      return results;
    });

    const groupedParticipantData = groupBy(rawParticipants, "participant_id");
    const results = Object.entries(groupedParticipantData)
      .reduce(
        (acc, cur) => {
          const [_, participantRoundData] = cur;
          const mappedParticipant = mapEntriesToObject(participantRoundData);

          acc.push(mappedParticipant);
          return acc;
        },
        [] as ReturnType<typeof mapEntriesToObject>[],
      )
      .sort((a, b) => +a.bestTimeMs! - +b.bestTimeMs!);

    return results;
  },
);

function mapEntriesToObject(participantRoundData: heat_participant[]) {
  const row = participantRoundData
    .filter(
      (i) =>
        (
          [
            "NotStarted",
            "Disqualified",
            "DidNotFinish",
          ] as ParticipantHeatStatusEnum[]
        ).includes(i.status!) === false,
    )
    .sort((a, b) => +a.total_time_ms! - +b.total_time_ms!)
    .map((i) => ({
      end_time: i.end_time,
      total_time_ms: i.total_time_ms,
      total_time_ms_pretty: millisecondsToHumanFormat(+i.total_time_ms!),
    }));

  const participant = participantRoundData[0];
  const bestTime = row[0];
  const result = {
    name: participant.name,
    participant_id: participant.participant_id,
    bestTimeMs: bestTime.total_time_ms,
    bestTimePretty: bestTime.total_time_ms_pretty,
    results: row,
  };

  return result;
}

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
      .sort((a, b) => +b.start_time! - +a.start_time!)
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

import { RaceTypeEnum, races } from "@prisma/client";

import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";

import { FinisherSchema } from "./schema";

export const getLaneRaceResults = action(FinisherSchema, async (input) => {
  const laneRaces = await _db.races.findMany({
    where: {
      event_id: input.eventId,
      race_type: RaceTypeEnum.LaneRace,
    },
  });

  const laneResults = laneRaces.reduce(
    (accum, curr) => {
      const rounds = mapLaneRaceToResults(curr);

      const qualifiers = rounds.filter(i => i.isQualifier);
      const normalRounds = rounds.filter(i => !i.isQualifier);

      accum.finals.push(normalRounds);
      accum.qualifiers.push(qualifiers);

      return accum;
    },
    { qualifiers: [], finals: [] } as LaneResultType,
  );

  const qualifierResults = laneResults.qualifiers.flatMap(q => {
    const participants = q.flatMap(i => {
      const result = i.heats.flatMap(h => h.participants).map(h => ({ ...h, roundName: i.roundName }));
      return result;
    });
    return participants;
  }).sort((a, b) => +a.timeTakenMs! - +b.timeTaken!);

  return {
    finalResults: laneResults.finals,
    qualifierResults
  };
});

type LaneResultType = {
  qualifiers: RoundType[],
  finals: RoundType[]
}

type RoundType = ReturnType<typeof mapLaneRaceToResults>

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


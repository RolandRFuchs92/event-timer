import { _db } from "@/lib/db";
import { action } from "@/lib/safeAction";

import { FinisherSchema } from "./schema";
import { RaceTypeEnum, races } from "@prisma/client";

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
      accum.push(rounds);
      return accum;
    },
    [] as ReturnType<typeof mapLaneRaceToResults>[],
  );

  return laneResults;
});

function mapLaneRaceToResults(race: races) {
  const rounds = race.rounds
    .map((r) => {
      const heats = r
        .heats
        .filter(i => i.is_closed)
        .map((h) => {
          return {
            heatNumber: h.index + 1,
            isClosed: h.is_closed,
            participants: h.participants.map((p) => {
              return {
                name: p.name,
                status: p.status,
                timeTakedMs: p.total_time_ms,
              };
            }),
          };
        });
      return {
        roundName: r.name,
        heats,
      };
    });

  return rounds;
}

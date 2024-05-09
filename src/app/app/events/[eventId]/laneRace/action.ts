import { action } from "@/lib/safeAction";
import { LaneRaceSchema } from "./schema";
import { _db } from "@/lib/db";

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

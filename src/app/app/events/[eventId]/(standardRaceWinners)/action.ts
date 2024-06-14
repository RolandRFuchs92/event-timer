import { differenceInMilliseconds, differenceInYears } from "date-fns";
import ordinal from "ordinal";
import { z } from "zod";
import { unstable_noStore } from "next/cache";

import { _db } from "@/lib/db";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";
import { action } from "@/lib/safeAction";

import { HomePageFilterSchema } from "../schema";

export const getStandardRaceTop5 = action(
  HomePageFilterSchema,
  async (input) => {
    unstable_noStore();
    const participants = await getAllParticipantsGroupedByRace(input);
    if (participants.length === 0) {
      const race = await _db.races.findFirst({
        where: {
          id: input.raceId,
        },
      });
      return {
        race: race?.name ?? "Unknown",
        results: {
          youthResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
          subYouthResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
          youthSeniorResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
          eliteResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
          veteranResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
          masterResult: {
            top5Males: [],
            top5Females: [],
            top5Overall: [],
          },
        },
      };
    }

    const results = getStandardRaceResults(participants);
    return results;
  },
);

type ParaticpiantResultType = Awaited<
  ReturnType<typeof getAllParticipantsGroupedByRace>
>;

function getStandardRaceResults(participants: ParaticpiantResultType) {
  const youthResult = extractResultByAgeGroup(participants, 0, 10);
  const subYouthResult = extractResultByAgeGroup(participants, 10, 15);
  const youthSeniorResult = extractResultByAgeGroup(participants, 15, 21);
  const eliteResult = extractResultByAgeGroup(participants, 21, 40);
  const veteranResult = extractResultByAgeGroup(participants, 40, 50);
  const masterResult = extractResultByAgeGroup(participants, 50, 110);

  const raceResultRow = {
    youthResult,
    subYouthResult,
    youthSeniorResult,
    eliteResult,
    veteranResult,
    masterResult,
  };

  const race = participants[0].race!;

  return {
    race,
    results: raceResultRow,
  };
}

function extractResultByAgeGroup(
  participants: ParaticpiantResultType,
  minAge: number,
  maxAge: number,
) {
  const validParticipants = participants.filter(
    (i) => minAge <= i.age! && maxAge > i.age!,
  );

  const top5Males = validParticipants
    .filter((i) => i.gender === "Male")
    .slice(0, 5)
    .map((i, index) => ({
      ...i,
      position: ordinal(index + 1),
    }));
  const top5Females = validParticipants
    .filter((i) => i.gender === "Female")
    .slice(0, 5)
    .map((i, index) => ({
      ...i,
      position: ordinal(index + 1),
    }));
  const top5Overall = validParticipants.slice(0, 5).map((i, index) => ({
    ...i,
    position: ordinal(index + 1),
  }));

  return {
    top5Males,
    top5Females,
    top5Overall,
  };
}

async function getAllParticipantsGroupedByRace(
  input: z.infer<typeof HomePageFilterSchema>,
) {
  const race = await _db.races.findFirst({
    where: {
      event_id: input.eventId,
      race_type: "StandardNoLaps",
      id: input.raceId,
    },
  });

  const allParticipants = await _db.participant.findMany({
    where: {
      event_id: input.eventId,
    },
  });

  if (!race) return [];

  const raceParticipants = race.batches
    .flatMap((b) =>
      b.participants.map((p) => {
        const me = allParticipants.find((i) => i.id === p.participant_id);
        const hasAFinishTime = !!p.finish_time;
        const hasValidFinishStatus = p.finish_status === "Finished";

        if (!me || !hasAFinishTime || !hasValidFinishStatus) return null;
        const time_taken = differenceInMilliseconds(
          p.finish_time!,
          b.start_on!,
        );

        return {
          name: `${me.first_name} ${me.last_name}[${me.race_number}]`,
          age: differenceInYears(new Date(), me.birthdate)!,
          race: race.name,
          gender: me.is_male ? "Male" : "Female",
          race_id: race.id,
          start_on: b.start_on,
          finish_time: p.finish_time,
          participant_id: p.participant_id,
          finish_status: p.finish_status,
          time_taken,
          time_taken_ms: millisecondsToHumanFormat(time_taken),
        };
      }),
    )
    .filter((i) => !!i)
    .sort((a, b) => +a!.time_taken! - +b!.time_taken!)
    .map((i, index) => {
      return {
        position: ordinal(index + 1),
        ...i,
      };
    });

  const result = raceParticipants;
  return result;
}

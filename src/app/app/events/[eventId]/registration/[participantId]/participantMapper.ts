"use server";

import { participant_race, races } from "@prisma/client";
import { RegistrationSchema } from "./schema";
import { z } from "zod";

export async function mapRelatedRacesToParticipantBatchs(
  input: z.infer<typeof RegistrationSchema>,
  races: races[],
) {
  const relatedRaces = races.filter((i) =>
    input.batches.some((b) => b.race_id === i.id),
  );

  const result = input.batches.reduce((acc, cur) => {
    const race = relatedRaces.find((i) => i.id === cur.race_id)!;

    if (race?.race_type === "StandardNoLaps")
      return [
        ...acc,
        {
          race_id: race.id,
          race_type: race.race_type,
          race_name: race.name,
          batch_index: +cur.batch_index,
        },
      ];

    return [
      ...acc,
      {
        batch_index: null,
        race_id: race!.id,
        race_type: race?.race_type,
        race_name: race!.name,
      },
    ];
  }, [] as participant_race[]);

  return result;
}

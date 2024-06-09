import React, { Suspense } from "react";

import { ResultsContainer } from "./ResultsFilter";
import { _db } from "@/lib/db";
import { z } from "zod";
import { FinisherFilterSchema } from "./schema";
import { RaceResultsSelector } from "./RaceResultsSelector";
import { parse } from "path";

interface ResultsPageProps {
  params: {
    eventId: string;
  };
  searchParams: z.infer<typeof FinisherFilterSchema>;
}

export default async function ResultsPage({
  params,
  searchParams,
}: ResultsPageProps) {
  const races = await _db.races.findMany({
    where: {
      event_id: params.eventId,
    },
  });

  const selectedRace = races.find((i) => i.id === searchParams.raceId);
  const parsedParams = FinisherFilterSchema.parse({
    ...searchParams,
    qualifier: searchParams.qualifier === ("true" as any),
  });
  console.log(parsedParams);

  return (
    <div>
      <ResultsContainer races={races} />
      {!!selectedRace ? (
        <RaceResultsSelector
          selectedRace={selectedRace}
          searchParams={parsedParams}
        />
      ) : null}
    </div>
  );
}

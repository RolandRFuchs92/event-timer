"use client";

import { z } from "zod";
import { FinisherFilterSchema } from "./schema";
import { races } from "@prisma/client";
import { Suspense } from "react";
import { LaneRaceQualifierResults } from "./LaneRaceQualifierResults";
import { LaneRaceResults } from "./LaneRaceResults";
import { StandardRaceResults } from "./StandardRaceResults";

interface LaneRaceResultsSelectorProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
  selectedRace: races;
}

export function RaceResultsSelector({
  selectedRace,
  searchParams,
}: LaneRaceResultsSelectorProps) {
  if (selectedRace.race_type === "StandardNoLaps")
    return (
      <Suspense key={selectedRace.id} fallback="Loading...">
        <StandardRaceResults searchParams={searchParams} />
      </Suspense>
    );

  if (searchParams.qualifier)
    return (
      <Suspense key={selectedRace.id} fallback="Loading...">
        <LaneRaceQualifierResults searchParams={searchParams} />
      </Suspense>
    );

  return (
    <Suspense key={selectedRace.id} fallback="Loading...">
      <LaneRaceResults searchParams={searchParams} />
    </Suspense>
  );
}

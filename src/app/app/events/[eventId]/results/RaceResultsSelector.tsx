"use client";

import React, { Suspense, useEffect } from "react";
import { z } from "zod";
import { races } from "@prisma/client";

import { FinisherFilterSchema } from "./schema";
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

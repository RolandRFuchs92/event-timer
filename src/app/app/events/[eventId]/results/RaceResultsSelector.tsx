"use client";

import { z } from "zod";
import { FinisherFilterSchema } from "./schema";
import { races } from "@prisma/client";
import { Suspense } from "react";
import { LaneRaceQualifierResults } from "./LaneRaceQualifierResults";
import { LaneRaceResults } from "./LaneRaceResults";
import { useSearchParams } from "next/navigation";

interface LaneRaceResultsSelectorProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
  selectedRace: races;
}

export function RaceResultsSelector({
  selectedRace,
  searchParams,
}: LaneRaceResultsSelectorProps) {
  if (selectedRace.race_type === "StandardNoLaps") return <h1>Boobs.</h1>;

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

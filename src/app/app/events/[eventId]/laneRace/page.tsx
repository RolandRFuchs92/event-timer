import React from "react";
import { getQualifierCompetitors } from "./action";
import { LaneRaceTable } from "./LaneRaceTable";

interface LaneRacePageProps {
  searchParams: {
    raceId: string;
  };
}

export default async function LaneRacePage({
  searchParams,
}: LaneRacePageProps) {
  const raceId = searchParams.raceId;
  const competitiors = await getQualifierCompetitors({ raceId });
  return <LaneRaceTable competitors={competitiors} />;
}

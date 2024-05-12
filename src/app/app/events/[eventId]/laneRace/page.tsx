import React from "react";
import { getLaneRace } from "./action";
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
  const laneRace = await getLaneRace({ raceId });
  return <LaneRaceTable laneRace={laneRace.data} />;
}

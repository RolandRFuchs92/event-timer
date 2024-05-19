import React from "react";
import { LaneRaceContainer } from "./LaneRaceContainer";
import { getLaneRace } from "./action";
import { LaneRaceFilter } from "./LaneRaceFilter";
import { LaneHeat } from "./LaneHeat";

interface LaneRaceTableProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function LaneRaceTable({ laneRace }: LaneRaceTableProps) {
  return (
    <div className="flex flex-row gap-4">
      <LaneRaceFilter laneRace={laneRace} />
      <React.Suspense fallback="Loading...">
        <LaneRaceContainer laneRace={laneRace} />
      </React.Suspense>
      {laneRace ? <LaneHeat laneRace={laneRace} /> : null}
    </div>
  );
}

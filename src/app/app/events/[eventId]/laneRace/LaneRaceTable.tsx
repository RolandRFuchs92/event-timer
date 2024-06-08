import React from "react";

import { RoundColumn } from "./RoundColumn";
import { getLaneRace } from "./action";
import { LaneRaceFilter } from "./LaneRaceFilter";
import { LaneHeat } from "./LaneHeat";

interface LaneRaceTableProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function LaneRaceTable({ laneRace }: LaneRaceTableProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-1 lg:grid-cols-3 lg:px-0">
      <LaneRaceFilter laneRace={laneRace} />
      <React.Suspense fallback="Loading...">
        <RoundColumn laneRace={laneRace} />
      </React.Suspense>
      {/* <div className="border lg:border-none" /> */}

      {laneRace ? <LaneHeat laneRace={laneRace} /> : null}
    </div>
  );
}

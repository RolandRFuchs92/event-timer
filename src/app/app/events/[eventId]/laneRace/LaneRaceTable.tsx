import React from 'react';
import { LaneRaceContainer } from "./LaneRaceContainer";
import { getLaneRace } from "./action";
import { LaneRaceFilter } from './LaneRaceFilter';

interface LaneRaceTableProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function LaneRaceTable({ laneRace }: LaneRaceTableProps) {

  return (
    <div className="flex flex-col">
      <LaneRaceFilter laneRace={laneRace} />
      <div>
        <React.Suspense fallback="Loading...">
          <LaneRaceContainer />
        </React.Suspense>
      </div>
    </div>
  );
}

import React from "react";
import { getLaneRaceResults } from "./action";

interface LaneRaceResultsProps {
  eventId: string;
}

export async function LaneRaceResults({ eventId }: LaneRaceResultsProps) {
  const laneResults = await getLaneRaceResults({ eventId: eventId });

  return (
    <div>
      <pre>{JSON.stringify(laneResults, null, 2)}</pre>
    </div>
  );
}

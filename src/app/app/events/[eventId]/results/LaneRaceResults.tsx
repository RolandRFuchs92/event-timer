import React from "react";
import { getLaneRaceResults } from "./action";
import { RoundNames } from "./RoundNames";

interface LaneRaceResultsProps {
  eventId: string;
}

export async function LaneRaceResults({ eventId }: LaneRaceResultsProps) {
  const laneResults = await getLaneRaceResults({ eventId: eventId });

  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="text-gray-700 pl-4 text-lg">Event Results</h1>
      {!!laneResults?.data?.length &&
        laneResults?.data?.map((laneResult) => {
          return (
            <div className="flex flex-col gap-4 overflow-x-scroll p-2 lg:flex-row">
              {(!!laneResult?.length ?? 0) &&
                laneResult?.map((heats) => {
                  return <RoundNames key={heats?.roundName} data={heats} />;
                })}
            </div>
          );
        })}
      {/* <pre>{JSON.stringify(laneResults?.data, null, 2)}</pre> */}
    </div>
  );
}

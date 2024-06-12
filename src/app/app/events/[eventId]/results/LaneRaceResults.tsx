"use client";

import React from "react";
import { z } from "zod";

import { getLaneRaceResults } from "./action";
import { RoundNames } from "./RoundNames";
import { FinisherFilterSchema } from "./schema";
import { useQuery } from "react-query";

interface LaneRaceResultsProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
}

export async function LaneRaceResults({ searchParams }: LaneRaceResultsProps) {
  const query = useQuery(
    "getLaneRaceResults",
    () => getLaneRaceResults(searchParams),
    {
      refetchInterval: +searchParams.refresh * 1000,
    },
  );
  const laneResults = query.data;

  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="text-gray-700 pl-4 text-lg">Event Results</h1>
      {!!laneResults?.data?.length &&
        laneResults?.data?.map((laneResult, index) => {
          return (
            <div
              key={index}
              className="flex flex-col overflow-x-scroll lg:flex-row lg:gap-2"
            >
              {(!!laneResult?.length ?? 0) &&
                laneResult?.map((heats) => {
                  return <RoundNames key={heats?.roundName} data={heats} />;
                })}
            </div>
          );
        })}
    </div>
  );
}

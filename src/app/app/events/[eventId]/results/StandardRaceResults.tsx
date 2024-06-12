"use client";

import { useQuery } from "react-query";
import React from "react";
import { z } from "zod";
import { twMerge } from "tailwind-merge";

import { FinisherFilterSchema } from "./schema";
import { getStandardRaceResults } from "./action";

interface StandardRaceResultsProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
}

export function StandardRaceResults({
  searchParams,
}: StandardRaceResultsProps) {
  const data = useQuery(
    "getStandardRaceResults(searchParams)",
    () => getStandardRaceResults(searchParams),
    {
      refetchInterval: searchParams.refresh * 1000,
    },
  );
  const result = data.data;

  return (
    <div className="max-w-screen flex flex-col flex-wrap gap-3 overflow-scroll overflow-y-hidden  py-2 pt-4 text-black lg:flex-row">
      {result?.data?.length &&
        result?.data?.map((i) => {
          const customClassName =
            i?.position == "1st"
              ? "bg-yellow-400"
              : i?.position == "2nd"
                ? "bg-slate-300"
                : i?.position == "3rd"
                  ? "bg-orange-300"
                  : "";

          return (
            <div
              key={i.participant_id}
              className={twMerge(
                "flex flex-col rounded-md bg-white p-2 lg:w-[15rem] lg:min-w-[15rem]",
                customClassName,
              )}
            >
              <div className="flex flex-row justify-between">
                <p className="text-lg font-bold text-slate-700 underline">{`${i?.position}`}</p>
                <p className="text-lg font-bold text-slate-700 underline">
                  {i?.name}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <span>{`Time: ${i?.time_taken}`}</span>
                <span>{`Age: ${i?.age}`}</span>
              </div>
              <span>{`Gender: ${i?.is_male ? "Male" : "Female"}`}</span>
            </div>
          );
        })}
    </div>
  );
}

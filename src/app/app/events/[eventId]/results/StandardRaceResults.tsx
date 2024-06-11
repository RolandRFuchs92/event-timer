import React from "react";
import { FinisherFilterSchema } from "./schema";
import { z } from "zod";
import { races } from "@prisma/client";
import { getStandardRaceResults } from "./action";
import { twMerge } from "tailwind-merge";

interface StandardRaceResultsProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
}

export async function StandardRaceResults({
  searchParams,
}: StandardRaceResultsProps) {
  const result = await getStandardRaceResults(searchParams);

  return (
    <div className="max-w-screen flex flex-col gap-3 overflow-scroll overflow-y-hidden py-2 pt-4 lg:flex-row">
      {result?.data?.length &&
        result?.data?.map((i) => {
          const customClassName =
            i?.position == "1st"
              ? "bg-green-400"
              : i?.position == "2nd"
                ? "bg-slate-300"
                : i?.position == "3rd"
                  ? "bg-yellow-400"
                  : "";

          return (
            <div className="flex flex-col gap-2 rounded-md bg-white p-2 lg:w-[15rem] lg:min-w-[15rem]">
              <p className="text-lg font-bold text-slate-700 underline">
                {i?.name}
              </p>
              <p>{`Batch: ${i?.batch}`}</p>
              <p
                className={twMerge("p-1", customClassName)}
              >{`Position: ${i?.position}`}</p>
              <p>{`Time: ${i?.time_taken}`}</p>
            </div>
          );
        })}
    </div>
  );
}

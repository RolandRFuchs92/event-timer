import React from "react";
import { z } from "zod";
import { FinisherFilterSchema } from "./schema";
import { getQualifierLaneRaceResults } from "./action";
import { twMerge } from "tailwind-merge";

interface LaneRaceQualifierResultProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
}
export async function LaneRaceQualifierResults({
  searchParams,
}: LaneRaceQualifierResultProps) {
  const results = await getQualifierLaneRaceResults(searchParams);
  const ggg = results?.data;
  const x = [...ggg!, ...ggg!];
  return (
    <div className="md:max-w-screen flex w-full flex-col gap-2 overflow-x-scroll  py-2 md:flex-row">
      {!!results?.data &&
        x?.map((i) => {
          return (
            <div className=" flex min-w-[18rem] flex-col gap-2 rounded-md border-[0.1rem] border-slate-600 bg-white p-2 md:w-[18rem]">
              <p className="text-lg font-bold underline">{i?.name}</p>
              <p>Best time {i?.bestTimePretty}</p>
              {!!i?.results?.length &&
                i?.results?.map((j, index: number) => {
                  const raceStatusClassname =
                    index == 0
                      ? "bg-green-400"
                      : index == 1
                        ? "bg-slate-200"
                        : index == 2
                          ? "bg-orange-300"
                          : "";
                  return (
                    <div
                      key={j?.total_time_ms}
                      className={twMerge("rounded-sm p-1", raceStatusClassname)}
                    >
                      <p className="">
                        {`${index + 1}) 
                        ${j?.total_time_ms_pretty}
                        `}
                      </p>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}

"use client";

import React from "react";

import { getLaneRace } from "./action";
import { HeatInteractions } from "./HeatInteractions";
import { HeatDisplay } from "./HeadDisplay";

interface LaneHeatProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function LaneHeat({ laneRace }: LaneHeatProps) {
  return (
    <div className="flex flex-col gap-6 rounded-sm bg-white px-1 text-slate-600 outline outline-slate-300 lg:gap-2 lg:p-2">
      <HeatInteractions laneRace={laneRace} />
      <HeatDisplay laneRace={laneRace} />
    </div>
  );
}

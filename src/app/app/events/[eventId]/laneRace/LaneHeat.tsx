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
    <div className="flex flex-col gap-2">
      <HeatInteractions laneRace={laneRace} />
      <HeatDisplay laneRace={laneRace} />
    </div>
  );
}

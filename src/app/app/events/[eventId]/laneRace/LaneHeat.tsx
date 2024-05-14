"use client";

import React from "react";

import { getLaneRace } from "./action";
import { useRoundIndex } from "./hook";
import { HeatInteractions } from "./HeatInteractions";
import { HeatDisplay } from "./HeadDisplay";

interface LaneHeatProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function LaneHeat({ laneRace }: LaneHeatProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace!.heat_containers[roundIndex];
  const heat = round.heats[0];

  return (
    <div>
      <HeatInteractions laneRace={laneRace} />
      <HeatDisplay laneRace={laneRace} />
    </div>
  );
}

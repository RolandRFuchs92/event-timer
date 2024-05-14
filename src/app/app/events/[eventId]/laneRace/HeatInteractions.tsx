'use client';
import React from "react";
import { getLaneRace } from "./action";
import { useHeatIndexs, useRoundIndex } from "./hook";
import { Button } from "@/components/FormElements/button";
import { timeOnly } from "@/lib/DateTimeUtils";

interface HeatInteractionsProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatInteractions({ laneRace }: HeatInteractionsProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace!.heat_containers[roundIndex];
  const heatIndex = useHeatIndexs();
  const heat = round.heats[heatIndex];

  return (
    <div>
      <h1>Heat {heatIndex + 1} </h1>
      <div>
        <h3>Start Time: {
          heat.start_time
            ? timeOnly(heat.start_time)
            : "Not started"
        }
        </h3>
        <h3>Is Closed: {heat.is_closed ? "Yes" : "No"}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button label="Reset" disabled={heat.is_closed} />
        <Button label="Start" disabled={heat.is_closed} />

        <Button label="Delete" />
        <Button label="Close" />
      </div>
    </div >
  );
}

"use client";
import React from "react";
import {
  closeLaneRace,
  deleteHeat,
  getLaneRace,
  startLaneRace,
} from "./action";
import { useHeatIndexs, useLaneRaceId, useRoundIndex } from "./hook";
import { Button } from "@/components/FormElements/button";
import { timeOnly } from "@/lib/DateTimeUtils";
import toast from "react-hot-toast";
import TwDialog from "@/components/Dialog/Dialog";

interface HeatInteractionsProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatInteractions({ laneRace }: HeatInteractionsProps) {
  const raceId = useLaneRaceId();
  const roundIndex = useRoundIndex();
  const round = laneRace!.heat_containers[roundIndex];
  const heatIndex = useHeatIndexs();
  const heat = round.heats[heatIndex];

  const handleStartClick = async (startDate: Date | null) => {
    const result = await startLaneRace({
      race_id: raceId,
      start_date: startDate,
      heat_index: heatIndex,
      round_index: roundIndex,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  const handleCloseLaneRace = async () => {
    const result = await closeLaneRace({
      heat_index: heatIndex,
      race_id: raceId,
      round_index: roundIndex,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  const handleDeleteLaneRace = async () => {
    const result = await deleteHeat({
      round_index: roundIndex,
      race_id: raceId,
      heat_index: heatIndex,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  if (!heat) return null;

  return (
    <div>
      <h1>Heat {heatIndex + 1} </h1>
      <div>
        <h3>
          Start Time:{" "}
          {heat.start_time ? timeOnly(heat.start_time) : "Not started"}
        </h3>
        <h3>
          End Time:{" "}
          {heat.start_time ? timeOnly(heat.start_time) : "Not started"}
        </h3>
        <h3>Is Closed: {heat.is_closed ? "Yes" : "No"}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button label="Reset" onClick={() => handleStartClick(null)} />
        <Button
          label="Start"
          disabled={heat.is_closed}
          onClick={() => handleStartClick(new Date())}
        />

        <TwDialog<{}>
          title={`Really delete this heat?`}
          body={`Are you sure you want to delete this heat?`}
          onYes={async () => handleDeleteLaneRace()}
        >
          {(setData, toggle) => {
            return (
              <div>
                <Button
                  label="Delete"
                  onClick={() => {
                    setData({});
                    toggle();
                  }}
                />
              </div>
            );
          }}
        </TwDialog>
        <Button label="Close" onClick={handleCloseLaneRace} />
      </div>
    </div>
  );
}
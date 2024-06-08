"use client";

import React from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/FormElements/button";
import { timeOnly } from "@/lib/DateTimeUtils";
import TwDialog from "@/components/Dialog/Dialog";
import { BatchElapsedTime } from "@/components/time/TimeElapsed";

import {
  closeLaneRace,
  deleteHeat,
  getLaneRace,
  startLaneRace,
} from "./action";
import {
  useHeatIndexs,
  useLaneRaceId,
  useRoundIndex,
  useSetHeatIndex,
} from "./hook";

interface HeatInteractionsProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatInteractions({ laneRace }: HeatInteractionsProps) {
  const raceId = useLaneRaceId();
  const roundIndex = useRoundIndex();
  const setHeatIndex = useSetHeatIndex();
  const round = laneRace!.rounds[roundIndex];
  const heatIndex = useHeatIndexs();
  const heat = round?.heats[heatIndex];

  if (!heat) return null;

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

    setHeatIndex(null);
    toast.success(result.data!.message);
  };

  if (!heat) return null;

  return (
    <div>
      <b className="border-b-black text-lg ">Heat {heatIndex + 1} </b>
      <div>
        <h3>
          Start Time:{" "}
          {heat.start_time ? timeOnly(heat.start_time) : "Not started"}
        </h3>
        {heat.is_closed === false ? (
          <div>
            Elapsed Time: <BatchElapsedTime startTime={heat.start_time} />
          </div>
        ) : null}
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
                  className="w-full"
                  onClick={() => {
                    setData({});
                    toggle();
                  }}
                />
              </div>
            );
          }}
        </TwDialog>
        <Button
          label="Close"
          onClick={handleCloseLaneRace}
          disabled={heat.is_closed}
        />
      </div>
    </div>
  );
}

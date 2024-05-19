import React from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/FormElements/button";
import { timeOnly } from "@/lib/DateTimeUtils";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";
import TwDialog from "@/components/Dialog/Dialog";

import { finishLaneRace, getLaneRace } from "./action";
import { useHeatIndexs, useRoundIndex } from "./hook";
import { HeatForm } from "./HeatForm";

interface HeatDisplayProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatDisplay({ laneRace }: HeatDisplayProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace!.heat_containers[roundIndex];
  const heatIndex = useHeatIndexs();
  const heat = round?.heats[heatIndex];

  if (!heat) return null;

  const participantA = heat.participants[0];
  const participantB = heat.participants[1];

  return (
    <div className="flex flex-col gap-2">
      <DisplayParticipant
        participant={participantA}
        title="Participant A"
        race_id={laneRace!.id}
        round_index={roundIndex}
        heat_index={heatIndex}
      />
      <DisplayParticipant
        participant={participantB}
        title="Participant B"
        race_id={laneRace!.id}
        round_index={roundIndex}
        heat_index={heatIndex}
      />
    </div>
  );
}

interface DisplayParticipantProps {
  participant:
    | NonNullable<
        HeatDisplayProps["laneRace"]
      >["heat_containers"][0]["heats"][0]["participants"][0]
    | null;
  title: string;
  race_id: string;
  round_index: number;
  heat_index: number;
}

function DisplayParticipant({
  participant,
  title,
  race_id,
  round_index,
  heat_index,
}: DisplayParticipantProps) {
  const handleStop = async () => {
    const result = await finishLaneRace({
      heat_index: heat_index,
      round_index: round_index,
      race_id,
      participant_id: participant!.participant_id,
      finish_date: new Date(),
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  return (
    <TwDialog<NonNullable<typeof participant>>
      title={(i) => `Edit ${participant?.name ?? `${title} details`}`}
      body={<HeatForm participant={participant!} />}
      onYes={async () => {}}
      disableButtons
    >
      {(setData, toggle) => {
        return (
          <div className="rounded-md border border-white p-2">
            <b>{title}</b>
            {participant ? (
              <div>
                <b>{participant.name}</b>
                <div>
                  Finish Time:{" "}
                  {participant.end_time
                    ? timeOnly(participant.end_time)
                    : "Not finished"}
                </div>
                <div>Status: {participant.status}</div>
                <div>
                  Time Taken:{" "}
                  {participant.total_time_ms
                    ? millisecondsToHumanFormat(+participant.total_time_ms)
                    : "Not finished"}
                </div>
                <div className="flex grow flex-row gap-2">
                  <Button
                    label="Finish"
                    onClick={handleStop}
                    disabled={participant.status !== null}
                  />
                  <Button
                    label="Edit"
                    onClick={() => {
                      setData(participant);
                      toggle();
                    }}
                  />
                </div>
              </div>
            ) : (
              "No participant Set"
            )}
          </div>
        );
      }}
    </TwDialog>
  );
}

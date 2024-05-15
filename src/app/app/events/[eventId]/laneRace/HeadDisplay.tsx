import React from "react";
import { getLaneRace } from "./action";
import { useHeatIndexs, useRoundIndex } from "./hook";

interface HeatDisplayProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatDisplay({ laneRace }: HeatDisplayProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace!.heat_containers[roundIndex];
  const heatIndex = useHeatIndexs();
  const heat = round.heats[heatIndex];

  if (!heat) return null;

  const participantA = heat.participants[0];
  const participantB = heat.participants[1];

  return (
    <div className="flex flex-col gap-2">
      <DisplayParticipant participant={participantA} title="Participant A" />
      <DisplayParticipant participant={participantB} title="Participant B" />
    </div>
  );
}

interface DisplayParticipantProps {
  participant: NonNullable<
    HeatDisplayProps["laneRace"]
  >["heat_containers"][0]["heats"][0]["participants"][0]
  | null;
  title: string
}

function DisplayParticipant({ participant, title }: DisplayParticipantProps) {

  return <div className="rounded-md p-2 border border-white">
    <h3>{title}</h3>
    {
      participant
        ? <div>
          <h3>
            {participant.name}
          </h3>
          {participant.is_winner ? "Win" : "Lose"}

        </div>
        : "No participant Set"
    }
  </div>;
}

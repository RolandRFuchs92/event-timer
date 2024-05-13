"use client";

import React from "react";
import { getLaneRace } from "./action";
import { useHeatIndex } from "./hook";
import { heat_container } from "@prisma/client";

interface LaneRaceContainerProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export async function LaneRaceContainer({ laneRace }: LaneRaceContainerProps) {
  const heatIndex = useHeatIndex();
  const heat = laneRace?.heat_containers[heatIndex];

  return (
    <div>
      <div className="text-middle flex h-10 flex-col items-center">
        heat: {heat?.name}
      </div>
      <AllParticipants participants={heat?.all_participants ?? []} />
    </div>
  );
}

interface AllParticipantsProps {
  participants: NonNullable<
    LaneRaceContainerProps["laneRace"]
  >["heat_containers"][0]["all_participants"];
}

function AllParticipants({ participants }: AllParticipantsProps) {
  return (
    <div>
      <ul>
        {participants.map((i) => {
          return (
            <li key={i.id}>
              {i.first_name} {i.last_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

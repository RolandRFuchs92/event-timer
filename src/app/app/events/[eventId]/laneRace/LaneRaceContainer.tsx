"use client";

import React from "react";

import { getLaneRace } from "./action";
import { useRoundIndex } from "./hook";
import { HeatFilter } from "./HeatFilter";

export type LaneRaceType = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>;

interface LaneRaceContainerProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export async function LaneRaceContainer({ laneRace }: LaneRaceContainerProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace?.heat_containers[roundIndex];

  return (
    <div>
      <div className="text-middle flex h-10 flex-row items-center justify-between">
        <h3>Round: {round?.name}</h3>
      </div>
      <HeatFilter heats={round?.heats ?? []} />
      <AllParticipants participants={round?.all_participants ?? []} />
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
      <h3 className="font-bold">Competitors</h3>
      <ul className="flex w-64 flex-col gap-2">
        {participants.map((i) => {
          return (
            <li
              key={i.id}
              className="rounded-md border border-white p-2 text-xs"
            >
              {i.first_name} {i.last_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

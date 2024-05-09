import { UserPlusIcon } from "@/components/Icons/UserPlusIcon";
import { participant } from "@prisma/client";
import React from "react";

interface LaneRacerTileProps {
  participant: participant;
}

export function LaneRacerTile({ participant }: LaneRacerTileProps) {
  return (
    <div className="flex flex-row items-center gap-2 bg-black p-2">
      <UserPlusIcon className="cursor-pointer hover:stroke-white dark:hover:stroke-white" />
      <div className="flex flex-col gap-2">
        <span>
          {participant.first_name} {participant.last_name}
        </span>
        <b className="text-xs">{participant.race_number}</b>
      </div>
    </div>
  );
}

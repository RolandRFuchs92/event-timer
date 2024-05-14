import React from "react";
import { getLaneRace } from "./action";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import { useSetRoundIndex } from "./hook";

type T = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>["heat_containers"][0];

interface LaneRacerTileProps {
  heat_container: T;
  onDelete: (data: T) => Promise<void>;
}

export function LaneRaceTile({ heat_container, onDelete }: LaneRacerTileProps) {
  const setRoundIndex = useSetRoundIndex();

  return (
    <div className="flex flex-row items-center justify-between gap-2 [&_b]:hover:font-extrabold">
      <div
        className="flex grow cursor-pointer flex-row items-center gap-2 rounded-md border border-white bg-black p-2"
        onClick={() => setRoundIndex(heat_container.heat_index)}
      >
        <div className="flex flex-col gap-2">
          <b className="text-xs">{heat_container.name}</b>
        </div>
      </div>
      <TrashIcon
        className="h-7 w-7 cursor-pointer transition-all duration-150 hover:stroke-primary"
        onClick={() => onDelete(heat_container)}
      />
    </div>
  );
}

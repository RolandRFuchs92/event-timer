import React from "react";
import { getLaneRace } from "./action";
import { TrashIcon } from "@/components/Icons/TrashIcon";
import { useRoundIndex, useSetRoundIndex } from "./hook";
import { cn } from "@/lib/styles";

type T = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>["rounds"][0];

interface LaneRacerTileProps {
  round: T;
  onDelete: (data: T) => Promise<void>;
}

export function LaneRaceTile({ round, onDelete }: LaneRacerTileProps) {
  const roundIndex = useRoundIndex();
  const setRoundIndex = useSetRoundIndex();

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 [&_b]:hover:font-extrabold",
      )}
    >
      <div
        className={cn(
          "flex grow cursor-pointer flex-row items-center gap-2 rounded-md border border-white bg-black p-2",
          round.round_index === roundIndex ? "bg-white text-black" : "",
        )}
        onClick={() => setRoundIndex(round.round_index)}
      >
        <div className="flex flex-col gap-2">
          <b className="text-xs">{round.name}</b>
        </div>
      </div>
      {round.round_index !== roundIndex && (
        <TrashIcon
          className="h-7 w-7 cursor-pointer transition-all duration-150 hover:stroke-primary"
          onClick={() => onDelete(round)}
        />
      )}
    </div>
  );
}

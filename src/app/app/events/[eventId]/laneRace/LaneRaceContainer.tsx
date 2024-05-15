"use client";

import React from "react";

import { addLaneCompetitor, getLaneRace } from "./action";
import { useHeatIndexs, useLaneRaceId, useRoundIndex } from "./hook";
import { HeatFilter } from "./HeatFilter";
import toast from "react-hot-toast";

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
      <AllParticipants round={round!} />
    </div>
  );
}

interface AllParticipantsProps {
  round: NonNullable<LaneRaceContainerProps["laneRace"]>["heat_containers"][0];
}

function AllParticipants({ round }: AllParticipantsProps) {
  const roundIndex = useRoundIndex();
  const heatIndex = useHeatIndexs();
  const raceId = useLaneRaceId();
  const participants = round.all_participants;

  const handleParticipantAdd = async (participantId: string) => {
    const result = await addLaneCompetitor({
      participant_id: participantId,
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

  return (
    <div>
      <h3 className="font-bold">Competitors</h3>
      <ul className="flex w-64 flex-col gap-2">
        {participants
          .map((i) => {
            const currentHeat = round.heats.find((r) =>
              r.participants.some((p) => p.participant_id === i.id),
            );

            return (
              <li
                key={i.id}
                className="cursor-pointer rounded-md border border-white p-2 text-xs hover:font-extrabold"
                onClick={() => handleParticipantAdd(i.id)}
              >
                <p>
                  {i.first_name} {i.last_name} [{i.race_number}]
                </p>
                <sub>
                  {currentHeat
                    ? `Heat ${currentHeat!.index + 1}`
                    : `Not assigned to a heat yet.`}
                </sub>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

"use client";

import React from "react";
import toast from "react-hot-toast";

import { TrashIcon } from "@/components/Icons/TrashIcon";
import TwDialog from "@/components/Dialog/Dialog";

import {
  addLaneCompetitor,
  getLaneRace,
  removeCompetitorFromPool,
} from "./action";
import { useHeatIndexs, useLaneRaceId, useRoundIndex } from "./hook";
import { HeatFilter } from "./HeatFilter";

export type LaneRaceType = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>;

interface LaneRaceContainerProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export async function RoundColumn({ laneRace }: LaneRaceContainerProps) {
  const roundIndex = useRoundIndex();
  const round = laneRace?.rounds[roundIndex];

  return (
    <div className="rounded-sm p-2 outline outline-slate-300">
      <div className="text-middle  flex h-10 flex-row items-center justify-between">
        <h3>Round: {round?.name}</h3>
      </div>
      <HeatFilter heats={round?.heats ?? []} />
      <AllParticipants round={round!} />
    </div>
  );
}

interface AllParticipantsProps {
  round: NonNullable<LaneRaceContainerProps["laneRace"]>["rounds"][0];
}

function AllParticipants({ round }: AllParticipantsProps) {
  const roundIndex = useRoundIndex();
  const heatIndex = useHeatIndexs();
  const raceId = useLaneRaceId();
  const participants = round?.all_participants;
  if (!participants) return null;

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

  const handleRemoveCompetitor = async (participantId: string) => {
    const result = await removeCompetitorFromPool({
      race_id: raceId,
      participant_id: participantId,
      round_index: roundIndex,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  return (
    <TwDialog<(typeof round)["all_participants"][0]>
      title={(i) => `Remove competitor from pool`}
      body={(i) => `Are you sure you want to remove this competitor?`}
      onYes={async (i) => {
        await handleRemoveCompetitor(i.id);
      }}
    >
      {(setData, toggle) => {
        return (
          <div className="">
            <h3 className="font-bold">Competitors</h3>
            <ul className="flex flex-col gap-2">
              {participants.map((i) => {
                const currentHeat = round.heats.find((r) =>
                  r.participants.some((p) => p.participant_id === i.id),
                );

                return (
                  <li
                    key={i.id}
                    className="flex grow flex-row items-center rounded-md border border-white bg-white p-2 text-xs"
                  >
                    <div
                      className="grow cursor-pointer  hover:font-extrabold"
                      onClick={() => handleParticipantAdd(i.id)}
                    >
                      <p className="text-slate-800">
                        {i.first_name} {i.last_name} [{i.race_number}]
                      </p>
                      <sub className="text-slate-600">
                        {currentHeat
                          ? `Heat ${currentHeat!.index + 1}`
                          : `Not assigned to a heat yet.`}
                      </sub>
                    </div>
                    <TrashIcon
                      className="h-8 w-8 transition-all duration-150 hover:cursor-pointer hover:fill-blue-400"
                      onClick={() => {
                        setData(i);
                        toggle();
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    </TwDialog>
  );
}

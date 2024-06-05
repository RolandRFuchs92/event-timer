"use client";

import toast from "react-hot-toast";

import TwDialog from "@/components/Dialog/Dialog";
import { Button, LinkButton } from "@/components/FormElements/button";

import { LaneRaceTile } from "./LaneRacerTile";
import { deleteRound, getLaneRace } from "./action";
import { LaneNewRound } from "./LaneNewRound";
import { useLaneRaceId } from "./hook";
import { usePathname } from "next/navigation";

interface LaneRaceFilterProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

type T = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>["rounds"][0];

export function LaneRaceFilter({ laneRace }: LaneRaceFilterProps) {
  const raceId = useLaneRaceId();
  const pathname = usePathname();

  return (
    <TwDialog<T>
      body={(i) => "Reallt delete this heat?"}
      title={(i) =>
        `Really delete this ${i.name}? All containing data will be deleted.`
      }
      onYes={async (i) => {
        const result = await deleteRound({
          race_id: raceId,
          round_index: i.round_index,
        });

        if (result.serverError) {
          toast.error(result.serverError);
          return;
        }

        toast.success(result.data!.message);
      }}
    >
      {(setDeleteData, toggleDeleteData) => {
        const handleDelete = async (data: T) => {
          setDeleteData(data);
          toggleDeleteData();
        };
        return (
          <TwDialog<{}>
            body={(i) => <LaneNewRound />}
            disableButtons
            title={""}
            onYes={async (i) => { }}
          >
            {(setData, toggle) => {
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <h3>Race: {laneRace?.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      label="Add Round"
                      onClick={() => {
                        setData({});
                        toggle();
                      }}
                    />
                    <LinkButton
                      href={`${pathname}/${raceId}`}
                      label="Move Racers"
                    />
                  </div>
                  <h3>Rounds</h3>
                  {laneRace?.rounds.map((i) => {
                    return (
                      <LaneRaceTile
                        key={i.round_index.toString()}
                        round={i}
                        onDelete={handleDelete}
                      />
                    );
                  })}
                </div>
              );
            }}
          </TwDialog>
        );
      }}
    </TwDialog>
  );
}

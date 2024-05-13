"use client";

import { useForm } from "react-hook-form";
import { deleteHeat, getLaneRace } from "./action";
import { usePathname, useRouter } from "next/navigation";
import TwDialog from "@/components/Dialog/Dialog";
import { LaneRaceTile } from "./LaneRacerTile";
import { Button } from "@/components/FormElements/button";
import { LaneNewHeat } from "./LaneNewHeat";
import { useLaneRaceId } from "./hook";
import toast from "react-hot-toast";

interface LaneRaceFilterProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

type T = NonNullable<
  Awaited<ReturnType<typeof getLaneRace>>["data"]
>["heat_containers"][0];

export function LaneRaceFilter({ laneRace }: LaneRaceFilterProps) {
  const form = useForm();
  const raceId = useLaneRaceId();

  return (
    <TwDialog<T>
      body={(i) => "Reallt delete this heat?"}
      title={(i) =>
        `Really delete this ${i.name}? All containing data will be deleted.`
      }
      onYes={async (i) => {
        const result = await deleteHeat({
          race_id: raceId,
          heat_index: i.heat_index,
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
            body={(i) => <LaneNewHeat />}
            disableButtons
            title={""}
            onYes={async (i) => {}}
          >
            {(setData, toggle) => {
              return (
                <div className="flex w-64 flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <h3>{laneRace?.name}</h3>
                    <Button
                      label="Add"
                      onClick={() => {
                        setData({});
                        toggle();
                      }}
                    />
                  </div>
                  {laneRace?.heat_containers.map((i) => {
                    return (
                      <LaneRaceTile
                        key={i.heat_index.toString()}
                        heat_container={i}
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

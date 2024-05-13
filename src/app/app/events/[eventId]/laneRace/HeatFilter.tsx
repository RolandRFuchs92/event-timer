import { Dropdown } from "@/components/SelectGroup/Dropdown";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LaneRaceType } from "./LaneRaceContainer";
import { Button } from "@/components/FormElements/button";
import TwDialog from "@/components/Dialog/Dialog";
import { useHeatIndex, useLaneRaceId } from "./hook";
import { createNewHeat } from "./action";
import toast from "react-hot-toast";

interface HeatFilterProps {
  heats: LaneRaceType["heat_containers"][0]["heats"];
}

export function HeatFilter({ heats }: HeatFilterProps) {
  const raceId = useLaneRaceId();
  const heatIndex = useHeatIndex();

  const form = useForm();

  const handleSubmit = form.handleSubmit((data) => {
    alert(JSON.stringify(data))
  })

  const onNewHeatClick = async () => {
    const result = await createNewHeat({
      race_id: raceId,
      heat_index: heatIndex,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  };

  return (
    <TwDialog<{}> body="" onYes={async () => { }} title="">
      {(setData, toggle) => {
        return (
          <FormProvider {...form}>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <Dropdown
                options={heats}
                getKey={(i) => i.index.toString()}
                getValue={(i) => `Heat - ${i.index + 1}`}
                label="Heat"
                name="heat"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  label="New Heat"
                  type="button"
                  onClick={onNewHeatClick}
                />

                <Button
                  label="Set Heat"
                />
              </div>
            </form>
          </FormProvider>
        );
      }}
    </TwDialog>
  );
}

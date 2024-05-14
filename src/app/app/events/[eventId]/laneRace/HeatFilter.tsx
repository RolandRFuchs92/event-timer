import { Dropdown } from "@/components/SelectGroup/Dropdown";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LaneRaceType } from "./LaneRaceContainer";
import { Button } from "@/components/FormElements/button";
import TwDialog from "@/components/Dialog/Dialog";
import { useRoundIndex, useLaneRaceId, useSetHeatIndex } from "./hook";
import { createNewHeat } from "./action";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeatFilterSchema } from "./schema";

interface HeatFilterProps {
  heats: LaneRaceType["heat_containers"][0]["heats"];
}

export function HeatFilter({ heats }: HeatFilterProps) {
  const raceId = useLaneRaceId();
  const heatIndex = useRoundIndex();
  const setHeatIndex = useSetHeatIndex();

  const form = useForm({
    resolver: zodResolver(HeatFilterSchema),
    defaultValues: {
      heat_index: 0,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setHeatIndex(data.heat_index);
  });

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
                name="heat_index"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  label="New Heat"
                  type="button"
                  onClick={onNewHeatClick}
                />

                <Button label="Set Heat" />
              </div>
            </form>
          </FormProvider>
        );
      }}
    </TwDialog>
  );
}

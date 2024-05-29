"use client";

import React from 'react';
import { FormProvider, useForm } from "react-hook-form";

import TwDialog from "@/components/Dialog/Dialog";
import { Button } from "@/components/FormElements/button";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";

import { getLaneRace } from "./action";
import { getTopTimesOverMultipleRounds } from './assignParticipantsAction';
import { useLaneRaceId } from './hook';
import toast from 'react-hot-toast';
import { AssignRacersForm } from './AssignRacersForm';

interface AssignRacersInteractionProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function AssignRacersInteraction({
  laneRace,
}: AssignRacersInteractionProps) {
  return (
    <TwDialog<{}>
      body={(i) => <SelectRoundsForm rounds={laneRace!.rounds} />}
      title={(i) => `Really delete this All containing data will be deleted.`}
      onYes={async () => { }}
      disableButtons
    >
      {(setData, toggle) => {
        return (
          <Button
            label={`Assign Racers`}
            onClick={() => {
              setData({});
              toggle();
            }}
          />
        );
      }}
    </TwDialog>
  );
}

interface SelectRoundsFormProps {
  rounds: NonNullable<AssignRacersInteractionProps["laneRace"]>["rounds"];
}

function SelectRoundsForm({ rounds }: SelectRoundsFormProps) {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [racers, setRacers] = React.useState<any[]>([]);
  const raceId = useLaneRaceId();
  const formMethods = useForm<{ rounds: { value: string }[] }>({
    defaultValues: {
      rounds: [],
    },
  });

  const handleGetTopTimes = formMethods.handleSubmit(async data => {
    const result = await getTopTimesOverMultipleRounds({
      rounds: data.rounds.map(i => +i.value),
      race_id: raceId
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
    setRacers(result.data!.result);
    setIsSelecting(true)
  });

  const selectedRounds = formMethods.watch("rounds");

  return (
    <div className="flex w-full grow flex-col">
      {
        isSelecting
          ? <AssignRacersForm
            racers={racers}
            setIsSelecting={() => setIsSelecting(false)}
            rounds={
              rounds.filter(i => {
                const isSelected = selectedRounds.every(sr => +sr.value !== i.round_index);
                return isSelected;
              })
            }
          />
          : <FormProvider {...formMethods}>
            <div className="[&_select]:!bg-white [&_label]:!text-black">
              <MultiSelect
                className="grow"
                options={rounds}
                getKey={(i) => i.round_index.toString()}
                getLabel={(i) => i.name}
                name="rounds"
                label="Select Rounds"
              />
              <Button label="Get Top Times" onClick={handleGetTopTimes} />
            </div>
          </FormProvider >
      }
    </div >
  );
}

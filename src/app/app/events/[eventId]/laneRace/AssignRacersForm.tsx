"use client";

import z from "zod";
import { Checkbox } from "@/components/Checkboxes/CheckboxOne";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";
import { zodResolver } from "@hookform/resolvers/zod";
import { heat } from "@prisma/client";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { AssignRacersToRound } from "./schema";
import { FormData } from "@/components/FormElements/form";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { getLaneRace } from "./action";
import { Button } from "@/components/FormElements/button";
import { cn } from "@/lib/styles";
import { useLaneRaceId } from "./hook";
import { assignParticipants } from "./assignParticipantsAction";
import toast from "react-hot-toast";

type AssignRacersInteractionProps = Awaited<ReturnType<typeof getLaneRace>>;

interface AssignRacersFormProps {
  racers: NonNullable<heat["participants"][0]>[];
  rounds: NonNullable<AssignRacersInteractionProps["data"]>["rounds"];
  setIsSelecting: () => void;
}

export function AssignRacersForm({
  racers,
  rounds,
  setIsSelecting,
}: AssignRacersFormProps) {
  const raceId = useLaneRaceId();
  const form = useForm<z.infer<typeof AssignRacersToRound>>({
    resolver: zodResolver(AssignRacersToRound),
    defaultValues: {
      race_id: raceId,
      roundIndex: 0,
      racers: racers.map((i) => {
        return {
          ...i,
          isSelected: false,
        } as any;
      }),
    },
  });

  const racersFieldArray = useFieldArray({
    control: form.control,
    name: "racers",
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await assignParticipants(data);
    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data?.message ?? "");
  });

  return (
    <div>
      <FormProvider {...form}>
        <FormData />
        <div className="flex flex-row justify-end">
          <Button label="Back" onClick={setIsSelecting} />
        </div>
        <div className="[&_label]:!text-black [&_select]:!bg-white">
          <Dropdown
            options={rounds}
            getKey={(i) => i.round_index.toString()}
            getLabel={(i) => i.name}
            name="roundIndex"
            label="Transfer Racers to this Round"
          />
        </div>
        {racersFieldArray.fields.length === 0
          ? "There are no finished participants for this selection. Please go back."
          : racersFieldArray.fields.map((i, index) => {
              return (
                <div
                  key={i.participant_id}
                  className={cn("flex flex-row justify-between p-2")}
                >
                  <Checkbox
                    name={`racers.${index}.isSelected`}
                    label={i.name}
                  />
                  <p>{millisecondsToHumanFormat(+(i?.total_time_ms ?? 0))}</p>
                </div>
              );
            })}
        <div className="flex flex-row justify-end">
          <Button label="Transfer" onClick={handleSubmit} />
        </div>
      </FormProvider>
    </div>
  );
}

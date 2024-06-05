"use client";

import z from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { heat } from "@prisma/client";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { Checkbox } from "@/components/Checkboxes/CheckboxOne";
import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";
import { FormData, FormErrors } from "@/components/FormElements/form";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { Button } from "@/components/FormElements/button";
import { cn } from "@/lib/styles";

import { getLaneRace } from "../../action";
import { AssignRacersToRound } from "./schema";
import { useLaneRaceId } from "../../hook";
import { assignParticipants } from "./action";
import { usePathname, useRouter } from "next/navigation";

interface AssignRacersFormProps {
  racers: NonNullable<heat["participants"][0]>[];
  rounds: NonNullable<
    Awaited<ReturnType<typeof getLaneRace>>["data"]
  >["rounds"];
  raceId: string
}

export function AssignRacersForm({ racers, rounds, raceId }: AssignRacersFormProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
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
    alert("MEEP");
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
        <FormErrors />
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

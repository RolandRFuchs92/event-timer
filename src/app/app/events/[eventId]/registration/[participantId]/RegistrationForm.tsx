"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import toast from "react-hot-toast";

import { FormRow } from "@/components/FormElements/FormRow";
import { Button } from "@/components/FormElements/button";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { Form, FormData, FormErrors } from "@/components/FormElements/form";
import { Checkbox } from "@/components/Checkboxes/CheckboxOne";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { TrashIcon } from "@/components/Icons/TrashIcon";

import { getEventRaces, getParticipant, mutateParticipant } from "./action";
import { DefaultRegistration, RegistrationSchema } from "./schema";
import { useEventId } from "../../eventUtils";
import { z } from "zod";

interface RegistrationFormProps {
  races: Awaited<ReturnType<typeof getEventRaces>>;
  participant: Awaited<ReturnType<typeof getParticipant>>;
}

DefaultRegistration;
export function RegistrationForm({
  races,
  participant,
}: RegistrationFormProps) {
  const { replace } = useRouter();
  const eventId = useEventId();
  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: participant as any,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateParticipant({
      ...data,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
    replace(
      `/app/events/${eventId}/registration/${result.data!.result.id!.toString()}/display`,
    );
  });

  return (
    <Form
      formTitle={<FormTitle label={"Registration"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FormData />
      <FormErrors />
      <FormRow>
        <FInput name="first_name" label="First Name" />
        <FInput name="last_name" label="Last Name" />
      </FormRow>
      <Checkbox name="is_male" label="Is Male" />
      <FInput type="date" name="birthdate" label="Birthdate" />
      <BatchFieldArray races={races} />
      <Button label="Submit" />
    </Form>
  );
}

interface BatchFieldArrayProps {
  races: Awaited<ReturnType<typeof getEventRaces>>;
}

function BatchFieldArray({ races }: BatchFieldArrayProps) {
  const form = useFormContext<z.infer<typeof RegistrationSchema>>();
  const batchFieldArray = useFieldArray({
    name: "races",
    control: form.control,
  });

  const handleAddRace = () => {
    const batchCount = batchFieldArray.fields.length;
    batchFieldArray.insert(batchCount, { batch_index: "", race_id: "" });
  };

  const removeRaceAssignment = (index: number) => {
    batchFieldArray.remove(index);
  };

  return (
    <div>
      <Button label="Add Race" type="button" onClick={handleAddRace} />
      {batchFieldArray.fields.map((i, index) => {
        const thingy = form.watch(`races.${index}.race_id`);
        const selectedRace = races.find((r) => r.id === thingy);
        const batchOptions = selectedRace?.batches ?? [];
        const isLaneRace = selectedRace?.race_type === "LaneRace";

        const remainingRaceOptions = races.filter((r) => {
          const isCurrentOption = i.race_id === r.id;
          if (isCurrentOption) return true;

          const isChosen = batchFieldArray.fields.some(
            (bfa) => bfa.race_id === r.id,
          );

          return isChosen === false;
        });

        return (
          <div key={i.id} className="flex flex-row gap-2">
            <Dropdown
              options={remainingRaceOptions}
              getLabel={(i) => i.name}
              getKey={(i) => i.id}
              label="Race"
              name={`races.${index}.race_id`}
            />
            {!isLaneRace && selectedRace ? (
              <Dropdown
                options={batchOptions}
                getLabel={(i) => i.name}
                getKey={(i) => i.index.toString()}
                label="Batch"
                name={`races.${index}.batch_index`}
              />
            ) : null}
            <div
              className="relative cursor-pointer transition-all duration-150 hover:[&>svg]:fill-primary"
              role="button"
              onClick={() => removeRaceAssignment(index)}
            >
              <TrashIcon className="absolute left-1/2 top-1/2 ml-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

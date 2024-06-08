"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
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
  const form = useForm({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: participant,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateParticipant(eventId, data);
    toast.success(result.message);
    replace(`/app/events/${eventId}/participants`);
  });

  return (
    <Form
      formTitle={<FormTitle label={"Registration"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FormData />
      <FormRow>
        <FInput name="first_name" label="First Name" />
        <FInput name="last_name" label="Last Name" />
      </FormRow>
      <FInput name="race_number" label="Race Number" />
      <Checkbox name="is_male" label="Is Male" />
      <FInput type="date" name="birthdate" label="Birthdate" />
      <BatchFieldArray form={form} races={races} />
      <FormErrors />
      <Button label="Submit" />
    </Form>
  );
}

interface BatchFieldArrayProps {
  form: UseFormReturn<typeof DefaultRegistration>;
  races: Awaited<ReturnType<typeof getEventRaces>>;
}

function BatchFieldArray({ form, races }: BatchFieldArrayProps) {
  const batchFieldArray = useFieldArray({
    name: "batches",
    control: form.control,
  });

  const handleAddRace = () => {
    const batchCount = batchFieldArray.fields.length;
    batchFieldArray.insert(batchCount, { batch_id: "", race_id: "" });
  };

  const removeRaceAssignment = (index: number) => {
    batchFieldArray.remove(index);
  };

  return (
    <div>
      <Button label="Add Race" type="button" onClick={handleAddRace} />
      {batchFieldArray.fields.map((i, index) => {
        const thingy = form.watch(`batches.${index}.race_id`);
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
              name={`batches.${index}.race_id`}
            />
            {!isLaneRace && selectedRace ? (
              <Dropdown
                options={batchOptions}
                getLabel={(i) => i.name}
                getKey={(i) => i.index.toString()}
                label="Batch"
                name={`batches.${index}.batch_id`}
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

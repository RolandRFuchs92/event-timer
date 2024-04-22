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

import { getEventRaces, mutateParticipant } from "./action";
import { DefaultRegistration, RegistrationSchema } from "./schema";
import { useEventId } from "../../eventUtils";

interface RegistrationFormProps {
  races: Awaited<ReturnType<typeof getEventRaces>>;
}

export function RegistrationForm({ races }: RegistrationFormProps) {
  const { replace } = useRouter();
  const eventId = useEventId();
  const form = useForm({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: DefaultRegistration,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateParticipant(eventId, data);
    toast.success(result.message);
    replace("../");
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

  const handleAddBatch = () => {
    const batchCount = batchFieldArray.fields.length;
    batchFieldArray.insert(batchCount, { batch_id: "", race_id: "" });
  };

  return (
    <div>
      <Button label="Add batch" type="button" onClick={handleAddBatch} />
      {batchFieldArray.fields.map((i, index) => {
        const thingy = form.watch(`batches.${index}.race_id`);
        const selectedRace = races.find((r) => r.id === thingy);
        const batchOptions = selectedRace?.batches ?? [];

        return (
          <div key={i.id} className="flex flex-row gap-2">
            <Dropdown
              options={races}
              getValue={(i) => i.name}
              getKey={(i) => i.id}
              label="Race"
              name={`batches.${index}.race_id`}
            />
            <Dropdown
              options={batchOptions}
              getValue={(i) => i.name}
              getKey={(i) => i.batch_id}
              label="Batch"
              name={`batches.${index}.batch_id`}
            />
          </div>
        );
      })}
    </div>
  );
}

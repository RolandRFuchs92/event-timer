"use client";
import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { enumToOptions } from "@/lib/helper";
import React from "react";
import { useForm } from "react-hook-form";
import { setFinisher } from "./action";

interface FinisherFormProp {
  FinisherStatusOptions: ReturnType<typeof enumToOptions>;
}

export function FinishersForm({ FinisherStatusOptions }: FinisherFormProp) {
  const form = useForm({
    defaultValues: {
      race_number: "",
      finish_status: FinisherStatusOptions[0].value,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await setFinisher(data.race_number, data.finish_status);
  });

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label="Finishers" />}
      onSubmit={handleSubmit}
    >
      <FInput label="Race Number" name="race_number" />
      <Dropdown
        label="Finish Status"
        name="finish_status"
        options={FinisherStatusOptions}
        getKey={(i) => i.value}
        getValue={(i) => i.label}
      />
      <Button label="Submit" />
    </Form>
  );
}

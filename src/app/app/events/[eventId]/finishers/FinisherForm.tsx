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
import { useEventId, useRaceIds } from "../eventUtils";
import { FinishStatusEnum } from "@prisma/client";
import toast from "react-hot-toast";

interface FinisherFormProp {
  FinisherStatusOptions: ReturnType<typeof enumToOptions>;
}

export function FinishersForm({ FinisherStatusOptions }: FinisherFormProp) {
  const raceIds = useRaceIds();
  const eventId = useEventId();
  const form = useForm({
    defaultValues: {
      race_number: "",
      finish_status: FinisherStatusOptions[0].value as FinishStatusEnum,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await setFinisher({
      race_number: data.race_number,
      finish_status: data.finish_status,
      raceIds,
      event_id: eventId,
      finish_time: new Date(),
    });

    if (result.serverError) {
      toast.error(result.serverError);
      if (/you have already captured/ig.test(result.serverError))
        form.reset();

      return;
    }


    toast.success(result.data!.message);
    form.reset();
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
        getLabel={(i) => i.label}
      />
      <Button label="Submit" />
    </Form>
  );
}

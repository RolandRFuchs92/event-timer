"use client";

import React from "react";
import { changeParticipantFinishStatus, getFinishers } from "./action";
import { useRaceIds } from "../eventUtils";
import { useForm } from "react-hook-form";
import { ChangeParticipantFinishStatusSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { enumToOptions } from "@/lib/helper";
import { Button } from "@/components/FormElements/button";
import toast from "react-hot-toast";
import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";

interface ChangeFinisherStatusFormProps {
  participant: Awaited<ReturnType<typeof getFinishers>>[0];
  finisherStatusOptions: ReturnType<typeof enumToOptions>;
  toggle: () => void;
}

export function ChangeFinisherStatusForm({
  participant,
  finisherStatusOptions,
  toggle,
}: ChangeFinisherStatusFormProps) {
  const raceIds = useRaceIds();

  const form = useForm<z.infer<typeof ChangeParticipantFinishStatusSchema>>({
    resolver: zodResolver(ChangeParticipantFinishStatusSchema),
    defaultValues: {
      participantId: participant.participant_id,
      finish_time: participant.finish_time ?? (null as any),
      finish_status: participant.finish_status as any,
      raceIds,
    },
  });

  const handleChangeFinisherStatus = form.handleSubmit(async (data) => {
    const result = await changeParticipantFinishStatus(data);
    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data?.message ?? "");
    toggle();
  });

  return (
    <Form
      formMethods={form}
      onSubmit={handleChangeFinisherStatus}
      formTitle={<FormTitle label="Finish Status" />}
      className="w-full"
    >
      <FInput type="datetime-local" name="finish_time" step="0.1" />
      <Dropdown
        options={finisherStatusOptions}
        name="newFinishStatus"
        getLabel={(i) => i.label}
        getKey={(i) => i.value}
        label="New Finish Status"
      />
      <Button label="Submit" />
    </Form>
  );
}

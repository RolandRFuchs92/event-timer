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

interface ChangeFinisherStatusFormProps {
  participant: Awaited<ReturnType<typeof getFinishers>>[0];
  finisherStatusOptions: ReturnType<typeof enumToOptions>;
  toggle: () => void
}

export function ChangeFinisherStatusForm({
  participant,
  finisherStatusOptions,
  toggle
}: ChangeFinisherStatusFormProps) {
  const raceIds = useRaceIds();
  const status = participant.batches.find((i) =>
    raceIds.includes(i.race_id),
  )?.finish_status;
  const form = useForm<z.infer<typeof ChangeParticipantFinishStatusSchema>>({
    resolver: zodResolver(ChangeParticipantFinishStatusSchema),
    defaultValues: {
      participantId: participant.id,
      newFinishStatus: status as any,
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
    toggle()
  });

  return (
    <Form
      formMethods={form}
      onSubmit={handleChangeFinisherStatus}
      formTitle={<FormTitle label="Finish Status" />}
      className="w-full"
    >
      <Dropdown
        options={finisherStatusOptions}
        name="newFinishStatus"
        getValue={(i) => i.label}
        getKey={(i) => i.value}
        label="New Finish Status"
      />
      <Button label="Submit" />
    </Form>
  );
}

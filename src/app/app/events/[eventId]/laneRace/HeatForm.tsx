"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormData, FormErrors } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { Button } from "@/components/FormElements/button";

import { HeatParticipantSchema } from "./schema";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { CustomParticipantHeatStatusEnum } from "./LaneRaceEnums";
import { FInput } from "@/components/FormElements/input";
import { editHeatParticipant, getLaneRace } from "./action";
import { useHeatIndexs, useLaneRaceId, useRoundIndex } from "./hook";
import { z } from "zod";
import toast from "react-hot-toast";
import { timeOnly } from "@/lib/DateTimeUtils";

interface HeatFormProps {
  participant: NonNullable<
    Awaited<ReturnType<typeof getLaneRace>>["data"]
  >["heat_containers"][0]["heats"][0]["participants"][0];
}

export function HeatForm({ participant }: HeatFormProps) {
  const roundIndex = useRoundIndex();
  const heatIndex = useHeatIndexs();
  const laneRaceId = useLaneRaceId();
  const form = useForm<z.infer<typeof HeatParticipantSchema>>({
    resolver: zodResolver(HeatParticipantSchema),
    defaultValues: {
      heat_index: heatIndex,
      round_index: roundIndex,
      status: participant.status!,
      race_id: laneRaceId,
      end_time: participant.end_time
        ? timeOnly(participant.end_time)
        : (null as any),
      participant_id: participant.participant_id,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await editHeatParticipant({
      ...data,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }
    toast.success(result.data!.message);
  });

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label={`Edit ${participant.name}`} />}
      onSubmit={handleSubmit}
    >
      <FormData />
      <FormErrors />
      <FInput
        type="time"
        name="end_time"
        label="Finish Time stamp"
        step="0.1"
      />
      <Dropdown
        options={CustomParticipantHeatStatusEnum}
        label="Status"
        name="status"
        getKey={(i) => i.value}
        getValue={(i) => i.label}
      />
      <div className="flex flex-row gap-2">
        <Button label="Reset" type="reset" />
        <Button label="Submit" />
      </div>
    </Form>
  );
}

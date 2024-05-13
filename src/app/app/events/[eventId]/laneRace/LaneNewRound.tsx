"use client";

import React from "react";

import { FInput } from "@/components/FormElements/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/FormElements/button";
import { Form, FormErrors } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { createNewRound } from "./action";
import { useLaneRaceId } from "./hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewRoundSchema } from "./schema";
import toast from "react-hot-toast";

export function LaneNewRound() {
  const raceId = useLaneRaceId();
  const form = useForm({
    resolver: zodResolver(NewRoundSchema),
    defaultValues: {
      race_id: raceId,
      name: "",
      max_heats: 1,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createNewRound(data);
    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }
    toast.success(result.data!.message);
  });

  return (
    <Form formMethods={form} formTitle={<FormTitle label="Create Heat" />}>
      <FormErrors />
      <FInput label={"New heat name"} name="name" />
      <FInput label={"Max competitors"} type="number" name="max_heats" />
      <Button label="Submit" onClick={handleSubmit} />
    </Form>
  );
}

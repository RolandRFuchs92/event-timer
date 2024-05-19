"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { Button } from "@/components/FormElements/button";

import { HeatFormSchema } from "./schema";

export function HeatForm() {
  const form = useForm({
    resolver: zodResolver(HeatFormSchema),
    defaultValues: {},
  });

  return (
    <Form formMethods={form} formTitle={<FormTitle label="Edit Participant" />}>
      <Button label="Reset" />
      <Button label="Submit" />
    </Form>
  );
}

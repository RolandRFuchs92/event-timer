"use client";

import React from "react";
import { useForm } from 'react-hook-form'

import { Button } from "@/components/FormElements/button";
import { Form, FormErrors } from "@/components/FormElements/form";
import { FInput } from "@/components/FormElements/input";
import { useEventId } from "../eventUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CsvUploadSchema } from "./schema";
import { FormTitle } from "@/components/FormElements/formTitle";



export function RaceImportForm() {
  const eventId = useEventId()
  const form = useForm({
    resolver: zodResolver(CsvUploadSchema),
    defaultValues: {
      base64Url: "",
      separator: ",",
      event_id: eventId
    }
  });

  return <Form
    formMethods={form}
    formTitle={<FormTitle label="Import Participants" />}
  >
    <FInput name="separator" label="Separator used" />
    <FInput
      label="CSV file"
      type="file"
      name='csv_file'
      accept='.csv'
    />
    <FormErrors />
    <Button label="Submit" />
  </Form>

}

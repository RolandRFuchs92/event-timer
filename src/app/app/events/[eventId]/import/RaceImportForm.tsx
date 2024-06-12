"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/FormElements/button";
import { Form, FormErrors } from "@/components/FormElements/form";
import { FInput } from "@/components/FormElements/input";
import { useEventId } from "../eventUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CsvUploadSchema } from "./schema";
import { FormTitle } from "@/components/FormElements/formTitle";
import { importCsv } from "./action";
import toast from "react-hot-toast";
import { warn } from "console";

export function RaceImportForm() {
  const eventId = useEventId();
  const form = useForm({
    defaultValues: {
      csv_file: null as any,
      separator: ",",
      event_id: eventId,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const form = new FormData();
    form.append("csv_file", data.csv_file);
    form.append("event_id", eventId);
    form.append("separator", data.separator);

    const result = await importCsv(form);
    toast.success(result.message);
  });

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label="Import Participants" />}
      onSubmit={handleSubmit}
    >
      <FInput name="separator" label="Separator used" />
      <input
        name="csv_file_1"
        type="file"
        onChange={(e) => {
          form.setValue("csv_file", e?.target?.files![0]);
        }}
      />
      <FormErrors />
      <Button label="Submit" />
    </Form>
  );
}

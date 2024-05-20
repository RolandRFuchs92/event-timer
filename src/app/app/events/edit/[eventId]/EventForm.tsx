"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { FormRow } from "@/components/FormElements/FormRow";
import { Form, FormData } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { Button } from "@/components/FormElements/button";
import { Dropdown } from "@/components/SelectGroup/Dropdown";

import { EventSchema } from "./schema";
import { getClientOptions, getEvent, mutateEvent } from "./action";

interface EventFormProps {
  event: Awaited<ReturnType<typeof getEvent>>;
  clients: Awaited<ReturnType<typeof getClientOptions>>;
  opts: any[];
}

export function EventForm({ event, clients, opts }: EventFormProps) {
  const { replace } = useRouter();
  const form = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: event,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateEvent(data);
    toast.success(result.message);
    replace("../");
  });

  return (
    <Form
      formTitle={<FormTitle label={"Event"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FormData />
      <FInput name="name" label="Event Name" />
      <FormRow>
        <FInput
          type="datetime-local"
          name="start_on"
          label="Starts On"
          step="0.1"
        />
        <FInput
          type="datetime-local"
          name="end_on"
          label="Ends On"
          step="0.1"
        />
      </FormRow>

      <FInput
        type="datetime-local"
        name="created_on"
        label="Created On"
        step="0.1"
      />
      <Dropdown
        name="client_id"
        options={clients}
        getKey={(i) => i.value}
        getLabel={(i) => i.label}
        label="Client"
      />
      <MultiSelect name="event_type" options={opts} label="Type" />
      <Button label="Submit" />
    </Form>
  );
}

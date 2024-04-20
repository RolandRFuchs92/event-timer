"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { EventTypeEnum } from "@prisma/client";

import { FormRow } from "@/components/FormElements/FormRow";
import { FormData, Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { enumToOptions } from "@/lib/helper";
import { Button } from "@/components/FormElements/button";
import { Dropdown } from "@/components/SelectGroup/Dropdown";

import { EventSchema } from "./schema";
import { getClientOptions, getEvent, mutateEvent } from "./action";
import { useRouter } from "next/navigation";

interface EventFormProps {
  event: Awaited<ReturnType<typeof getEvent>>;
  clients: Awaited<ReturnType<typeof getClientOptions>>;
}

export function EventForm({ event, clients }: EventFormProps) {
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
  const opts = enumToOptions(EventTypeEnum);

  return (
    <Form
      formTitle={<FormTitle label={"Account"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
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
        getValue={(i) => i.label}
        label="Client"
      />
      <MultiSelect name="event_type" options={opts} label="Type" />
      <Button label="Submit" />
    </Form>
  );
}

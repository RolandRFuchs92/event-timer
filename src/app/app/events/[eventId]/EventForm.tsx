"use client";

import { EventTypeEnum } from "@prisma/client";
import { FormRow } from "@/components/FormElements/FormRow";
import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { enumToOptions } from "@/lib/helper";
import { useForm } from "react-hook-form";
import { EventSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEvent, mutateEvent } from "./action";
import toast from "react-hot-toast";
import { Button } from "@/components/FormElements/button";

interface EventFormProps {
  event: Awaited<ReturnType<typeof getEvent>>;
}

export function EventForm({ event }: EventFormProps) {
  const form = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: event,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateEvent(data);
    toast.success(result.message);
  });

  return (
    <Form
      formTitle={<FormTitle label={"Account"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FInput name="name" label="Name" />
      <FormRow>
        <FInput name="password" label="Password" type="password" />
        <FInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />
      </FormRow>
      <MultiSelect
        name="roles"
        options={enumToOptions(EventTypeEnum)}
        label="Roles"
      />
      <Button label="Submit" />
    </Form>
  );
}

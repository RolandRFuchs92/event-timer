"use client";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormRow } from "@/components/FormElements/FormRow";
import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/SelectGroup/Dropdown";

import { getAccountOptions, getClient, mutateClient } from "./actions";
import { clientSchema } from "./schema";

type ClientFormProps = {
  accountOptions: Awaited<ReturnType<typeof getAccountOptions>>;
  client: Awaited<ReturnType<typeof getClient>>;
};

export function ClientForm({ accountOptions, client }: ClientFormProps) {
  const { replace } = useRouter();
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: client,
  });
  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateClient(data);
    toast.success(result.message);
    replace("./");
  });

  return (
    <Form
      formTitle={<FormTitle label={"Account"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <pre>{JSON.stringify(form.watch())}</pre>
      <FormRow>
        <FInput name="name" label="Name" />
        <FInput name="credits" label="Credits" />
      </FormRow>
      <FormRow>
        <Dropdown
          getKey={(i) => i.value}
          getValue={(i) => i.label}
          name="account_id"
          options={accountOptions}
          label="Account"
        />
      </FormRow>
      <Button label="Submit" />
    </Form>
  );
}

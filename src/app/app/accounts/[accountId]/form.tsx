"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FInput } from "@/components/FormElements/input";
import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { RoleEnum } from "@prisma/client";

import { createNewEntry } from "../action";
import { AccountSchema } from "../schema";
import { enumToOptions } from "@/lib/helper";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { FormTitle } from "@/components/FormElements/formTitle";
import { useRouter } from "next/navigation";
import { FormRow } from "@/components/FormElements/FormRow";
import { getAccount } from "./action";
import toast from "react-hot-toast";

type AccountFormProps = {
  account: Awaited<ReturnType<typeof getAccount>>["data"];
};

export function AccountForm({ account }: AccountFormProps) {
  const { replace } = useRouter();
  const form = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      ...account!,
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createNewEntry(data);
    if (result.serverError) toast.error(result.serverError);
    replace("/app/accounts");
  });

  return (
    <Form
      formTitle={<FormTitle label={"Account"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FormRow>
        <FInput name="firstName" label="Name" />
        <FInput name="lastName" label="Last name" />
      </FormRow>
      <FInput name="email" label="Email" type="email" />
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
        options={enumToOptions(RoleEnum)}
        label="Roles"
      />
      <Button label="Submit" />
    </Form>
  );
}

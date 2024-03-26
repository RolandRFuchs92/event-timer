"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FInput } from "@/components/FormElements/input";
import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { RoleEnum } from "@prisma/client";

import { createNewEntry } from "../action";
import { someForm } from "../schema";
import { enumToOptions } from "@/lib/helper";
import { MultiSelect } from "@/components/SelectGroup/SelectGroupOne";
import { FormTitle } from "@/components/FormElements/formTitle";
import { useRouter } from "next/navigation";

export function AccountForm() {
  const { replace } = useRouter();
  const form = useForm({
    resolver: zodResolver(someForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roles: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createNewEntry(data);
    alert(JSON.stringify(result));
    replace("/app/accounts");
  });

  return (
    <Form formMethods={form} onSubmit={handleSubmit}>
      <FormTitle label={"Account"} />
      <FInput name="firstName" label="Name" />
      <FInput name="lastName" label="Last name" />
      <FInput name="email" label="Email" type="email" />
      <MultiSelect
        name="roles"
        options={enumToOptions(RoleEnum)}
        label="Roles"
      />
      <Button label="Submit" />
    </Form>
  );
}

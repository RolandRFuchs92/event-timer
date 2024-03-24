"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { someForm } from "./schema";
import { FInput } from "@/components/FormElements/input";
import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { createNewEntry } from "./action";

export function MongoForm() {
  const form = useForm({
    resolver: zodResolver(someForm),
    defaultValues: {
      name: "",
      lastName: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createNewEntry(data);
    alert(JSON.stringify(result));
  });

  return (
    <Form formMethods={form} onSubmit={handleSubmit}>
      <FInput name="name" label="Name" />
      <FInput name="lastName" label="Last name" />
      <Button label="Submit" />
    </Form>
  );
}

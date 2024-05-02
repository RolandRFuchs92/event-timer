"use client";
import { Form, FormData } from "@/components/FormElements/form";
import React from "react";
import { useForm } from "react-hook-form";
import { getRaces } from "./action";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { Button } from "@/components/FormElements/button";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinishersFilterSchema } from "./schema";
import { FormTitle } from "@/components/FormElements/formTitle";
import { z } from "zod";

interface FinishersFilterProps {
  races: Awaited<ReturnType<typeof getRaces>>;
}

export function FinishersFilter({ races }: FinishersFilterProps) {
  const form = useForm<z.infer<typeof FinishersFilterSchema>>({
    resolver: zodResolver(FinishersFilterSchema),
    defaultValues: {
      races: [],
    },
  });

  const pathName = usePathname();
  const { replace } = useRouter();

  const handleSubmit = form.handleSubmit((data) => {
    const newParams = new URLSearchParams();
    const races = encodeURIComponent(data.races.map((i) => i.value).join(","));
    newParams.set("races", races);
    const newUrl = `${pathName}?${newParams.toString()}`;
    replace(newUrl);
  });

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label="Finishers" />}
      onSubmit={handleSubmit}
    >
      <FormData />
      <MultiSelect
        options={races.map((i) => ({ value: i.id, label: i.name }))}
        name="races"
        label="Races"
      />
      <Button type="submit" label="Set Finishers" />
    </Form>
  );
}

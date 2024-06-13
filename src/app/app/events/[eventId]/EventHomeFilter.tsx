"use client";

import React from "react";

import { Form, FormData } from "@/components/FormElements/form";
import { races } from "@prisma/client";
import { useForm } from "react-hook-form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { Button } from "@/components/FormElements/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomePageFilterSchema } from "./schema";
import { z } from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface EventHomeFilter {
  eventId: string
  races: races[]
}

export function EventHomeFilter({ races, eventId }: EventHomeFilter) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const raceId = searchParams.get("raceId");
  const form = useForm<z.infer<typeof HomePageFilterSchema>>({
    resolver: zodResolver(HomePageFilterSchema),
    defaultValues: {
      eventId: eventId,
      raceId: raceId ?? ""
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    const searchParams = new URLSearchParams();
    searchParams.set("raceId", data.raceId);
    replace(`${pathname}?${searchParams.toString()}`);
  })

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label="Race Winner Filter" />}
      onSubmit={handleSubmit}
    >
      <Dropdown
        options={races}
        getKey={i => i.id}
        getLabel={i => i.name}
        name="raceId"
        label="Race"
      />
      <FormData />
      <Button label="Submit" />
    </Form>
  );
}

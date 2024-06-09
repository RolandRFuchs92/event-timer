"use client";

import { races } from "@prisma/client";
import React from "react";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/Checkboxes/CheckboxOne";
import { Form, FormData, FormErrors } from "@/components/FormElements/form";
import { FInput } from "@/components/FormElements/input";
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/FormElements/button";
import { FormTitle } from "@/components/FormElements/formTitle";

import { FinisherFilterSchema } from "./schema";

interface ResultsContainerProps {
  races: races[];
}

export function ResultsContainer({ races }: ResultsContainerProps) {
  const form = useForm<z.infer<typeof FinisherFilterSchema>>({
    defaultValues: {
      raceId: "" as any,
      refresh: 5,
      qualifier: false,
    },
    resolver: zodResolver(FinisherFilterSchema),
  });
  const pathname = usePathname();
  const { replace } = useRouter();

  const raceId = form.watch("raceId");
  const race = races.find((i) => i.id === raceId);
  const isLaneRace = race?.race_type === "LaneRace";

  const handleSubmit = form.handleSubmit((data) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("refresh", data.refresh.toString());
    newSearchParams.set("raceId", data.raceId);
    newSearchParams.set("qualifier", data.qualifier.toString());

    replace(`${pathname}?${newSearchParams.toString()}`);
  });

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        formMethods={form}
        formTitle={<FormTitle label="Filter Form" />}
      >
        <FormData />
        <FormErrors />
        <div className="grid grid-cols-3 items-center gap-2">
          <Dropdown
            options={races}
            label={"Races"}
            getKey={(i) => i.id}
            getLabel={(i) => i.name}
            name={"raceId"}
          />
          <FInput name="refresh" label="Refresh interval seconds" />
          {isLaneRace ? (
            <Checkbox label="Is Qualifier" name="qualifier" />
          ) : null}
        </div>
        <Button label="Filter" />
      </Form>
    </div>
  );
}
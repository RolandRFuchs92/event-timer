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
import { Dropdown } from "@/components/SelectGroup/Dropdown";
import { enumToOptions } from "@/lib/helper";
import { useEventId } from "../eventUtils";

interface FinishersFilterProps {
  races: Awaited<ReturnType<typeof getRaces>>;
  raceTypes: ReturnType<typeof enumToOptions>;
}

export function FinishersFilter({ races, raceTypes }: FinishersFilterProps) {
  const eventId = useEventId();
  const form = useForm<z.infer<typeof FinishersFilterSchema>>({
    resolver: zodResolver(FinishersFilterSchema),
    defaultValues: {
      races: [],
      race_type: "StandardNoLaps",
    },
  });

  const pathName = usePathname();
  const { replace } = useRouter();
  const givenRaceType = form.watch("race_type");

  const handleSubmit = form.handleSubmit((data) => {
    const newParams = new URLSearchParams();
    const races = encodeURIComponent(data.races.map((i) => i.value).join(","));
    newParams.set("races", races);
    const newPathName =
      givenRaceType === "LaneRace"
        ? `/app/events/${eventId}/laneRace`
        : pathName;
    const newUrl = `${newPathName}?${newParams.toString()}`;
    replace(newUrl);
  });

  return (
    <Form
      formMethods={form}
      formTitle={<FormTitle label="Finishers" />}
      onSubmit={handleSubmit}
    >
      <FormData />

      <Dropdown
        options={raceTypes}
        label="Race Type"
        getKey={(i) => i.value}
        getLabel={(i) => i.label}
        name="race_type"
      />

      <MultiSelect
        key={givenRaceType}
        options={races
          .filter((i) => {
            return i.race_type === givenRaceType;
          })
          .map((i) => ({ value: i.id, label: i.name }))}
        getKey={(i) => i.value}
        getLabel={(i) => i.label}
        name="races"
        label="Races"
      />
      <Button type="submit" label="Set Finishers" />
    </Form>
  );
}

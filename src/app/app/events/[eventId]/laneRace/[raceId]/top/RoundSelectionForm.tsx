"use client";

import { Button } from "@/components/FormElements/button";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getTopTimesOverMultipleRounds } from "./action";
import { getLaneRace } from "../../action";
import { MultiSelect } from "@/components/SelectGroup/MultiSelect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RoundSelectionFormProps {
  raceId: string;
  eventId: string;
  laneRace: NonNullable<Awaited<ReturnType<typeof getLaneRace>>["data"]>;
}

export function RoundSelectionForm({
  raceId,
  eventId,
  laneRace,
}: RoundSelectionFormProps) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const formMethods = useForm<{ rounds: { value: string }[] }>({
    defaultValues: {
      rounds: [],
    },
  });

  const handleShowTopTimes = formMethods.handleSubmit(async (data) => {
    const roundIndexes = data.rounds.map((i) => +i.value).join("-");
    const newSearchParmas = new URLSearchParams();
    newSearchParmas.set("rounds", roundIndexes);

    const newUrl = `${pathname}?${newSearchParmas.toString()}`;
    replace(newUrl);
  });

  const rounds = laneRace.rounds;

  return (
    <div>
      <FormProvider {...formMethods}>
        <div className="[&_label]:!text-black [&_select]:!bg-white">
          <MultiSelect
            className="grow"
            options={rounds}
            getKey={(i) => i.round_index.toString()}
            getLabel={(i) => i.name}
            name="rounds"
            label="Select Rounds"
          />
          <Button label="Show Top Times" onClick={handleShowTopTimes} />
        </div>
      </FormProvider>
    </div>
  );
}

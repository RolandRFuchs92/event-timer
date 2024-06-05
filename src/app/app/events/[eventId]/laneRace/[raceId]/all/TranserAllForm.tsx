"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/FormElements/form";
import { Button } from "@/components/FormElements/button";
import { FormTitle } from "@/components/FormElements/formTitle";
import { Dropdown } from "@/components/SelectGroup/Dropdown";

import { TransferAllParticipantsSchema } from "./schema";
import { transferAllParticipants } from "./action";
import { getLaneRace } from "../../action";

interface TransferAllFormProps {
  raceId: string;
  rounds: NonNullable<
    Awaited<ReturnType<typeof getLaneRace>>["data"]
  >["rounds"];
}

export function TransferAllForm({ rounds, raceId }: TransferAllFormProps) {
  const { replace } = useRouter();
  const formMethods = useForm<z.infer<typeof TransferAllParticipantsSchema>>({
    resolver: zodResolver(TransferAllParticipantsSchema),
    defaultValues: {
      raceId,
      fromRoundIndex: 0,
      toRoundIndex: 0,
    },
  });

  const handleSubmit = formMethods.handleSubmit(async (data) => {
    const result = await transferAllParticipants(data);

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
    const baseUrl = `/app/events/${result.data!.result.event_id}/laneRace`;
    const urlParams = new URLSearchParams();
    urlParams.set("raceId", raceId);
    urlParams.set("roundIndex", data.toRoundIndex.toString());
    replace(`${baseUrl}?${urlParams.toString()}`);
  });

  return (
    <div>
      <Form
        formMethods={formMethods}
        formTitle={<FormTitle label="Transfer All" />}
        onSubmit={handleSubmit}
      >
        <Dropdown<TransferAllFormProps["rounds"][0]>
          options={rounds}
          label={"From Round"}
          getKey={(i) => i.round_index.toString()}
          getLabel={(i) => i.name}
          name={"fromRoundIndex"}
        />

        <h3>Transfer</h3>
        <Dropdown<TransferAllFormProps["rounds"][0]>
          options={rounds}
          label={"To Round"}
          getKey={(i) => i.round_index.toString()}
          getLabel={(i) => i.name}
          name={"toRoundIndex"}
        />
        <Button label="Submit" />
      </Form>
    </div>
  );
}

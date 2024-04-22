"use client";

import { Button } from "@/components/FormElements/button";
import { Form, FormData } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { useFieldArray, useForm } from "react-hook-form";
import { getRace, mutateRace } from "./action";
import { zodResolver } from "@hookform/resolvers/zod";
import { RaceSchema } from "./schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEventId } from "../../eventUtils";

interface RaceFormProps {
  race: Awaited<ReturnType<typeof getRace>>;
}

export function RaceForm({ race }: RaceFormProps) {
  const eventId = useEventId();
  const { replace } = useRouter();
  const form = useForm({
    defaultValues: {
      ...race,
      event_id: eventId,
    },
    resolver: zodResolver(RaceSchema),
  });
  const batchRows = useFieldArray({
    name: "batches",
    control: form.control,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await mutateRace(data);
    toast.success(result.message);
    replace("./");
  });

  const insertBatch = () => {
    const batchCount = batchRows.fields.length;
    batchRows.insert(batchCount, { name: "" });
  };

  return (
    <Form
      formTitle={<FormTitle label={"Race"} />}
      formMethods={form}
      onSubmit={handleSubmit}
    >
      <FormData />

      <FInput name="name" label="Race Name" />
      <div>
        <h3>Batches</h3>
        <Button type="button" label="Add Batch" onClick={insertBatch} />
      </div>
      <div className="flex flex-wrap gap-2">
        {batchRows.fields.map((i, index) => {
          return (
            <div key={i.id} className="flex flex-wrap gap-2">
              <FInput
                name={`batches.${index}.name`}
                label={`Batch ${index + 1}`}
              />
              <Button
                className="self-end"
                label="Delete"
                onClick={() => batchRows.remove(index)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button label="Submit" />
      </div>
    </Form>
  );
}
import { LinkButton } from "@/components/FormElements/button";
import { _db } from "@/lib/db";
import { cn } from "@/lib/styles";
import React from "react";
import { getBatchParticipants } from "./action";

interface ParticipantsProps {
  params: {
    index: string;
    eventId: string;
    raceId: string;
  };
}

export default async function Participants({ params }: ParticipantsProps) {
  const batch = await getBatchParticipants({
    race_id: params.raceId,
    batch_index: +params.index,
  });

  const participants = batch.data?.result.participants ?? [];

  return (
    <div className="flex flex-col gap-2">
      <h1>Participants</h1>
      <LinkButton label="Batches" href="batch" />
      {participants.length === 0 ? (
        <h3>There are not participants for this batch</h3>
      ) : (
        <div className="border-gray-400 flex flex-col gap-2 border">
          {participants.map((i, index) => (
            <div
              key={i.id}
              className={cn({ "bg-gray-200": index % 2 === 0 }, "p-2")}
            >
              {i.first_name} {i.last_name} ({i.race_number})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { LinkButton } from "@/components/FormElements/button";
import React from "react";
import { getParticipant } from "../action";
import { _db } from "@/lib/db";

interface DisplayParticipantProps {
  params: {
    participantId: string;
    eventId: string;
  };
}

export default async function DisplayParticipant({
  params,
}: DisplayParticipantProps) {
  const participant = await getParticipant(
    params.eventId,
    params.participantId,
  );

  const races = await _db.races.findMany({
    where: {
      id: {
        in: participant.races.map((i) => i.race_id),
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="border-gray-400 flex flex-col gap-2 rounded-md border bg-black p-2 text-center">
        <h1 className="text-3xl">
          Name: {participant.first_name} {participant.last_name}
        </h1>
        <div className="flex flex-col">
          <h2 className="text-4xl">Race Number: </h2>
          <b className="my-4 text-5xl">{participant.race_number}</b>
        </div>
        <h2 className="text-3xl">Races: </h2>
        <ul>
          {participant.races.map((i) => {
            const race = races.find((r) => r.id === i.race_id)!;

            return (
              <li key={i.race_id}>
                {race.race_type === "LaneRace"
                  ? race.name
                  : `${race.name}, Batch: ${race.batches[+i.batch_index!].name}`}
              </li>
            );
          })}
        </ul>
      </div>
      <LinkButton
        href={`/app/events/${params.eventId}/participants`}
        label="Back"
      />
    </div>
  );
}

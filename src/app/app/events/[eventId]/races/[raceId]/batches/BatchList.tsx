import { LinkButton } from "@/components/FormElements/button";
import { _db } from "@/lib/db";
import React from "react";

interface BatchListProps {
  raceId: string;
}

export async function BatchList({ raceId }: BatchListProps) {
  const race = await _db.races.findFirst({
    where: {
      id: raceId,
    },
  });

  if (race === null) return <h3>There are no batches for this race.</h3>;

  return (
    <div className="flex flex-col gap-2">
      {race.batches.map((i) => (
        <LinkButton
          key={i.batch_id}
          href={`batches/${i.batch_id}/batch`}
          label={i.name}
        />
      ))}
    </div>
  );
}

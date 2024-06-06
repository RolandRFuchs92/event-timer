import { LinkButton } from "@/components/FormElements/button";
import { _db } from "@/lib/db";
import React from "react";
import { getBatches } from "./action";

interface BatchListProps {
  raceId: string;
}

export async function BatchList({ raceId }: BatchListProps) {
  const batches = await getBatches(raceId);

  if (!batches.data?.length)
    return <h3>There are no batches for this race.</h3>;

  return (
    <div className="flex flex-row gap-2">
      {batches.data.map((i, index) => (
        <LinkButton key={index} href={`/${index}/batch`} label={i.name} />
      ))}
    </div>
  );
}

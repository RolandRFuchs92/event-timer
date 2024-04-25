import { LinkButton } from "@/components/FormElements/button";
import React from "react";
import { BatchTimerTile } from "./BatchTimerTiles";
import { _db } from "@/lib/db";

interface BatchPageProps {
  params: {
    batchId: string;
    raceId: string;
  };
}

export default async function BatchPageProps({
  params: { batchId, raceId },
}: BatchPageProps) {
  const race = await _db.races.findFirst({
    where: {
      id: raceId,
    },
  });

  const batch = race?.batches.find((i) => i.batch_id === batchId);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Batch: {batch?.name ?? "Unknown"}</h1>
      <LinkButton label="Participants" href="participants" />
      <BatchTimerTile batch={batch} />
    </div>
  );
}

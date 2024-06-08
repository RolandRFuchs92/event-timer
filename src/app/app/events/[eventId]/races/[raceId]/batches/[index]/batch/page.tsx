import { LinkButton } from "@/components/FormElements/button";
import React from "react";
import { BatchTimerTile } from "./BatchTimerTiles";
import { _db } from "@/lib/db";
import { getRace } from "../../../action";

interface BatchPageProps {
  params: {
    index: string;
    raceId: string;
  };
}

export default async function BatchPageProps({ params }: BatchPageProps) {
  const race = await getRace(params.raceId);
  const batch = race.batches[+params.index];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Batch: {batch?.name ?? "Unknown"}</h1>
      <LinkButton label="Participants" href="participants" />
      <BatchTimerTile batch={batch as any} />
    </div>
  );
}

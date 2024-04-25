import React, { Suspense } from "react";
import { BatchList } from "./BatchList";

interface BatchPageProps {
  params: {
    raceId: string;
    eventId: string;
  };
}

export default function BatchPage({ params }: BatchPageProps) {
  const raceId = params.raceId;

  return (
    <div>
      <h3>Batches</h3>
      <Suspense fallback={<h1>LOADING</h1>}>
        <BatchList raceId={raceId} />
      </Suspense>
    </div>
  );
}

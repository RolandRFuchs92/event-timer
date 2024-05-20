import React, { Suspense } from "react";

import { LaneRaceResults } from "./LaneRaceResults";

interface ResultsPageProps {
  params: {
    eventId: string;
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  return (
    <div>
      <Suspense fallback="Loading...">
        <LaneRaceResults eventId={params.eventId} />
      </Suspense>
    </div>
  );
}

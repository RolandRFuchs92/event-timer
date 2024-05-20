import React, { Suspense } from "react";

import { LaneRaceResults } from "./LaneRaceResults";
import { LinkButton } from "@/components/FormElements/button";

interface ResultsPageProps {
  params: {
    eventId: string;
  },
  searchParams: {
    hideLayout?: boolean
  }
}

export default async function ResultsPage({ params, searchParams }: ResultsPageProps) {
  return (
    <div>
      {
        searchParams.hideLayout
          ? <LinkButton href={`/app/events/${params.eventId}/results`} label="Show Layout" />
          : <LinkButton href={`/app/events/${params.eventId}/results?hideLayout=true`} label="Hide Layout" />
      }
      <Suspense fallback="Loading...">
        <LaneRaceResults eventId={params.eventId} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { getLaneRace } from "../../action";
import { RoundSelectionForm } from "./RoundSelectionForm";
import { TopRacerLoader } from "./TopRacerLoader";

interface TopCompetitorsTransferProps {
  params: {
    event_id: string;
    raceId: string;
  };
  searchParams: {
    rounds?: string;
  };
}

export default async function TopCompetitorsTransfer({
  params,
  searchParams,
}: TopCompetitorsTransferProps) {
  const laneRace = await getLaneRace({ raceId: params.raceId });
  const rounds = searchParams.rounds?.split("-").map((i) => +i) ?? [];

  return (
    <div>
      <h4>Select rounds to pull competitors from </h4>
      <RoundSelectionForm
        raceId={params.raceId}
        eventId={params.event_id}
        laneRace={laneRace.data!}
      />
      <Suspense key={searchParams.rounds ?? ""} fallback="Loading...">
        <TopRacerLoader
          race_id={params.raceId}
          selected_rounds={rounds}
          roundOptions={laneRace.data?.rounds ?? []}
        />
      </Suspense>
    </div>
  );
}

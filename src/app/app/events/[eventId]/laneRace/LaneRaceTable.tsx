import { LaneRacerTile } from "./LaneRacerTile";
import { getQualifierCompetitors } from "./action";

interface LaneRaceTableProps {
  competitors: Awaited<ReturnType<typeof getQualifierCompetitors>>;
}

export function LaneRaceTable({ competitors }: LaneRaceTableProps) {
  return (
    <div className="flex flex-col">
      <h1>Lane Race Participants</h1>
      <div className="flex w-64 flex-col gap-2">
        {competitors.data!.map((i) => (
          <LaneRacerTile participant={i} key={i.id} />
        ))}
      </div>
    </div>
  );
}

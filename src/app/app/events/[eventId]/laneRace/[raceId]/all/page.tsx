import { getLaneRace } from "../../action";
import { TransferAllForm } from "./TranserAllForm";

interface AllProps {
  params: {
    eventId: string;
    raceId: string;
  };
}

export default async function All({ params }: AllProps) {
  const race = await getLaneRace({ raceId: params.raceId });

  return (
    <div>
      <TransferAllForm
        raceId={params.raceId}
        rounds={race.data?.rounds ?? []}
      />
    </div>
  );
}

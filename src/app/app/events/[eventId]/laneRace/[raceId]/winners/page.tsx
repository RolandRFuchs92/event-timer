import { getLaneRace } from "../../action";
import { TransferWinnersForm } from "./TransferWinnersForm";

interface WinnersProps {
  params: {
    eventId: string,
    raceId: string
  }
}


export default async function Winners({ params }: WinnersProps) {
  const race = await getLaneRace({ raceId: params.raceId });

  return <div>
    <TransferWinnersForm
      raceId={params.raceId}
      rounds={race.data?.rounds ?? []}
    />
  </div>
}

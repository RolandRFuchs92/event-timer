import { RaceTable } from "./RaceTable";
import { getEventRaces } from "./action";

interface RacePageProps {
  params: {
    eventId: string;
  };
}

export default async function RacesPage({ params }: RacePageProps) {
  const eventId = params.eventId;
  const races = await getEventRaces(eventId);
  return <RaceTable data={races} />;
}

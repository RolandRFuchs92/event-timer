import { _db } from "@/lib/db";
import { EventHomeFilter } from "./EventHomeFilter";
import { RaceResultsFork } from "./RaceResultsFork";
import { getRaces } from "./action";

interface EventHomeProps {
  params: {
    eventId: string;
  },
  searchParams: {
    raceId: string
  }
}

export default async function EventHome({ params, searchParams }: EventHomeProps) {
  const races = await getRaces(params.eventId);
  const selectedRace = races.find(i => i.id === searchParams.raceId);
  const isLaneRace = selectedRace?.race_type === "LaneRace"

  return <div>
    <EventHomeFilter races={races} eventId={params.eventId} />
    <RaceResultsFork eventId={params.eventId} raceId={searchParams.raceId} isLaneRace={isLaneRace} />
  </div>
}

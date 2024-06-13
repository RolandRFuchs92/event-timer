import { _db } from "@/lib/db";
import { EventHomeFilter } from "./EventHomeFilter";
import { RaceResultsFork } from "./RaceResultsFork";

interface EventHomeProps {
  params: {
    eventId: string;
  },
  searchParams: {
    raceId: string
  }
}

export default async function EventHome({ params, searchParams }: EventHomeProps) {
  const races = await _db.races.findMany({
    where: {
      event_id: params.eventId
    }
  });

  return <div>
    <EventHomeFilter races={races} eventId={params.eventId} />
    <RaceResultsFork eventId={params.eventId} raceId={searchParams.raceId} />
  </div>
}

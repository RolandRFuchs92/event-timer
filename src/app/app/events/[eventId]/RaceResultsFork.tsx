import { StandartRaceWinners } from "./(standardRaceWinners)/StandardRaceWinners";

interface RaceResultsFork {
  raceId: string,
  eventId: string
}

export function RaceResultsFork({ raceId, eventId }: RaceResultsFork) {

  return <StandartRaceWinners eventId={eventId} raceId={raceId} />;
}

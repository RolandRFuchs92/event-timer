import { LaneRaceWinners } from "./(laneRaceWinners)/LaneRaceWinners";
import { StandartRaceWinners } from "./(standardRaceWinners)/StandardRaceWinners";

interface RaceResultsFork {
  raceId: string,
  eventId: string,
  isLaneRace: boolean
}

export function RaceResultsFork({ raceId, eventId, isLaneRace }: RaceResultsFork) {

  if (!isLaneRace)
    return <StandartRaceWinners eventId={eventId} raceId={raceId} />;
  return <LaneRaceWinners />
}

import React from 'react';
import { getStandardRaceTop5 } from './action';

interface StandardRaceWinnerProps {
  eventId: string
}

export async function StandartRaceWinners({ eventId }: StandardRaceWinnerProps) {
  const winners = await getStandardRaceTop5(eventId);
  return <div className="w-90">
    <pre>
      {JSON.stringify(winners, null, 2)}
    </pre>
  </div>
}

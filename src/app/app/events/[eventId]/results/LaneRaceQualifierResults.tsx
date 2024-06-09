
import React from 'react';
import { z } from 'zod';
import { FinisherFilterSchema } from './schema';
import { getQualifierLaneRaceResults } from './action';


interface LaneRaceQualifierResultProps {
  searchParams: z.infer<typeof FinisherFilterSchema>
}
export async function LaneRaceQualifierResults({ searchParams }: LaneRaceQualifierResultProps) {
  const results = await getQualifierLaneRaceResults(searchParams);

  return <pre>
    {JSON.stringify(results, null, 2)}
  </pre>
}

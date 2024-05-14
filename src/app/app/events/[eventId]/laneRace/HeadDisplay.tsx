import React from 'react';
import { getLaneRace } from './action';

interface HeatDisplayProps {
  laneRace: Awaited<ReturnType<typeof getLaneRace>>["data"];
}

export function HeatDisplay({ laneRace }: HeatDisplayProps) {
  return <h1>Heat Display</h1>
}

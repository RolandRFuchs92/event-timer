'use client';

import { useParams } from "next/navigation";

export function useBatchRaceId() {
  const { raceId } = useParams<{ raceId: string }>();

  return raceId;
}

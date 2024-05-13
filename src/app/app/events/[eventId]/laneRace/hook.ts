"use client";

import { useSearchParams } from "next/navigation";

export function useLaneRaceId() {
  const searchParams = useSearchParams();
  const raceId = searchParams.get("raceId");
  return raceId!;
}

export function useHeatIndex() {
  const searchParams = useSearchParams();
  const heatIndex = searchParams.get('idx');

  if (!heatIndex) return 0;
  return +heatIndex;
}

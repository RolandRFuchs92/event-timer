"use client";

import { useSearchParams } from "next/navigation";

export function useLaneRaceId() {
  const searchParams = useSearchParams();
  const raceId = searchParams.get("raceId");
  return raceId!;
}

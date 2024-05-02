"use client";

import { useParams, useSearchParams } from "next/navigation";

export function useEventId() {
  const params = useParams<{ eventId: string }>();
  return params.eventId;
}

export function useRaceIds() {
  const params = useSearchParams();
  const rawRaces = params.get("races");
  if (!rawRaces) return [];
  const raceIds = decodeURIComponent(rawRaces).split(",");
  return raceIds;
}

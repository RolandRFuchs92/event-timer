"use client";

import { useParams } from "next/navigation";

export function useEventId() {
  const params = useParams<{ eventId: string }>();
  return params.eventId;
}

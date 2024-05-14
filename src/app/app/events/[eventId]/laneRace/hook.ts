"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useLaneRaceId() {
  const searchParams = useSearchParams();
  const raceId = searchParams.get("raceId");
  return raceId!;
}

export function useSetRoundIndex() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setRoundIndex = (roundIndex: number) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("raceId", searchParams.get("raceId")!);
    newSearchParams.set("roundIndex", roundIndex.toString());

    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return setRoundIndex;
}

export function useRoundIndex() {
  const searchParams = useSearchParams();
  const roundIndex = searchParams.get('roundIndex');

  if (!roundIndex) return 0;
  return +roundIndex;
}

export function useSetHeatIndex() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handleSetHeatIndex(index: number) {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("raceId", searchParams.get("raceId")!);
    newSearchParams.set("roundIndex", searchParams.get("roundIndex")!);
    newSearchParams.set("heatIndex", index.toString());
    const newUrl = `${pathname}?${newSearchParams.toString()}`
    replace(newUrl);
  }

  return handleSetHeatIndex;
}

export function useHeatIndexs() {
  const searchParams = useSearchParams();
  const heatIndex = +(searchParams.get("heatIndex") ?? 0);
  return heatIndex;
}

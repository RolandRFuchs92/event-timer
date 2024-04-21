import React from "react";
import { RaceForm } from "./RaceForm";
import { getRace } from "./action";

interface RacePageProps {
  params: {
    raceId: string;
  };
}

export default async function RacePage({ params }: RacePageProps) {
  const raceId = params.raceId;
  const race = await getRace(raceId);

  console.log(race);
  return <RaceForm race={race} />;
}

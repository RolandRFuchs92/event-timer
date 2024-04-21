import React from "react";

interface RacePageProps {
  params: {
    raceId: string;
  };
}

export default async function RacePage({ params }: RacePageProps) {
  return <h1>{params.raceId}</h1>;
}

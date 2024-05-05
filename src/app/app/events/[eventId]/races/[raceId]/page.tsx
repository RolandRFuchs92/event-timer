import React from "react";
import { RaceForm } from "./RaceForm";
import { getRace } from "./action";
import { enumToOptions } from "@/lib/helper";
import { RaceTypeEnum } from "@prisma/client";

interface RacePageProps {
  params: {
    raceId: string;
  };
}

export default async function RacePage({ params }: RacePageProps) {
  const raceId = params.raceId;
  const race = await getRace(raceId);
  const raceTypes = enumToOptions(RaceTypeEnum);

  return <RaceForm race={race} raceTypes={raceTypes} />;
}

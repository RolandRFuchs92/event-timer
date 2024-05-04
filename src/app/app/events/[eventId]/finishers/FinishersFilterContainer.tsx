import { enumToOptions } from "@/lib/helper";
import { FinishersFilter } from "./FinishersFilter";
import { getRaces } from "./action";
import { RaceTypeEnum } from "@prisma/client";

export async function FinishersFilterContainer() {
  const races = await getRaces();
  const raceTypes = enumToOptions(RaceTypeEnum);
  return <FinishersFilter races={races} raceTypes={raceTypes} />;
}

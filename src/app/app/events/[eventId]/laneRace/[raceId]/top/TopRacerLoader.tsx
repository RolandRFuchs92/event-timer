import { AssignRacersForm } from "./TopRacersForm";
import { getTopTimesOverMultipleRounds } from "./action";
import { getLaneRace } from "../../action";

interface TopRacerLoaderProps {
  race_id: string;
  selected_rounds: number[];
  roundOptions: NonNullable<
    Awaited<ReturnType<typeof getLaneRace>>["data"]
  >["rounds"];

}

export async function TopRacerLoader({
  race_id,
  selected_rounds,
  roundOptions,
}: TopRacerLoaderProps) {
  const racerTimes = await getTopTimesOverMultipleRounds({
    race_id,
    rounds: selected_rounds,
  });

  if (!racerTimes.data?.result.length)
    return <h4>No results found for selected rounds.</h4>

  return (
    <AssignRacersForm
      rounds={roundOptions}
      racers={racerTimes.data?.result ?? []}
      raceId={race_id}
    />
  );
}

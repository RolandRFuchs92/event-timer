import React from "react";
import { getStandardRaceTop5 } from "./action";
import { cn } from "@/lib/styles";

interface StandardRaceWinnerProps {
  eventId: string;
  raceId: string;
}

export async function StandartRaceWinners({
  eventId,
  raceId,
}: StandardRaceWinnerProps) {
  const winners = await getStandardRaceTop5({ eventId, raceId });
  if (!winners.data?.results ?? true) return null;
  const results = Object.entries(winners.data.results);

  return (
    <div className="pt-2">
      <h1 className="text-2xl font-bold">{winners.data?.race ?? "Unknwon"}</h1>
      {results
        .filter(([key, value]) => {
          const hasResults = value.top5Overall.length > 0;
          return hasResults;
        })
        .map(([key, value]) => {
          return (
            <div key={key} className="block grow flex-row gap-2">
              <div>
                <h1 className="font-bold">{key}</h1>
                <div className="grid grid-cols-3">
                  <DisplayWinners
                    label="Top 5 Males"
                    isMale={true}
                    winners={value.top5Males}
                  />
                  <DisplayWinners
                    label="Top 5 Females"
                    isMale={false}
                    winners={value.top5Females}
                  />
                  <DisplayWinners
                    label="Top 5 Overall"
                    isMale={null}
                    winners={value.top5Overall}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

type DisplayWinnersProps = {
  label: string;
  winners: NonNullable<
    Awaited<ReturnType<typeof getStandardRaceTop5>>["data"]
  >["results"]["youthResult"]["top5Males"];
  isMale: boolean | null;
};

function DisplayWinners({ winners, label, isMale }: DisplayWinnersProps) {
  if (!winners.length) return null;

  return (
    <div
      className={cn(
        isMale ? "bg-blue-300" : isMale === false ? "bg-pink-200" : "bg-white",
        "ml-2 w-full p-2 text-black",
      )}
    >
      <h2> {label}</h2>
      {winners.map((i) => (
        <div key={i.participant_id} className="">
          {i.position}) {i.name} - {i.time_taken_ms}
        </div>
      ))}
    </div>
  );
}

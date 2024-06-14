import { millisecondsToHumanFormat } from "@/lib/getTimerDifference";
import { getLaneRaceWinners } from "./action";

export async function LaneRaceWinners({
  raceId,
  eventId,
}: {
  raceId: string;
  eventId: string;
}) {
  const result = await getLaneRaceWinners({ raceId, eventId });

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <LaneRaceResultsDisplay
        label={"Semi Finals"}
        heats={result.data?.secondLastRound ?? []}
      />
      <LaneRaceResultsDisplay
        label={"Finals"}
        heats={result.data?.lastRound ?? []}
      />
    </div>
  );
}

type LaneRaceResultsDisplay = {
  heats: NonNullable<
    Awaited<ReturnType<typeof getLaneRaceWinners>>["data"]
  >["lastRound"];
  label: string;
};

function LaneRaceResultsDisplay({ heats, label }: LaneRaceResultsDisplay) {
  return (
    <div className="flex flex-col gap-2 bg-black p-2">
      <h1>{label}</h1>
      <div className="flex flex-col gap-2">
        {heats.map((i) => {
          if (!i.participants.length) return null;
          return (
            <div
              key={i.heat}
              className="flex flex-col gap-2 rounded-md border p-2"
            >
              <h2>{i.heat}</h2>
              {i.participants.map((p) => {
                return (
                  <div key={p.participant_id}>
                    {p.status}){p.name} -{" "}
                    {millisecondsToHumanFormat(+p.total_time_ms!)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

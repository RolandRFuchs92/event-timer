import { LinkButton } from "@/components/FormElements/button";
import { _db } from "@/lib/db";
import {} from "react";

interface RaceLegendProps {
  eventId: string;
}

export async function RaceLegend({ eventId }: RaceLegendProps) {
  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
    orderBy: {
      race_type: "asc",
    },
  });

  return (
    <div className="gap-2 rounded-md border border-gray-2 bg-white p-2">
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="text-3xl">Races</h1>
        <LinkButton
          className="w-40 grow-0"
          type="button"
          href="/api/csvTemplate"
          label={"Download Csv Template"}
        />
      </div>
      {races.map((i) => {
        return (
          <div key={i.id} className="border border-gray-2 bg-black p-2">
            {i.name}: {i.id}
            {i.race_type === "LaneRace" ? null : (
              <ul className="ml-4 flex flex-col">
                [batch index] - batch name
                {i.batches.map((i) => {
                  return (
                    <div>
                      [{i.index}] - {i.name}
                    </div>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

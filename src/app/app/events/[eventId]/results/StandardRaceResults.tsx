import React from "react";
import { FinisherFilterSchema } from "./schema";
import { z } from "zod";
import { races } from "@prisma/client";
import { getStandardRaceResults } from "./action";

interface StandardRaceResultsProps {
  searchParams: z.infer<typeof FinisherFilterSchema>;
}

export async function StandardRaceResults({
  searchParams,
}: StandardRaceResultsProps) {
  const result = await getStandardRaceResults(searchParams);

  return (
    <div>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

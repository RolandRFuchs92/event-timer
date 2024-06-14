'use server';

import { action } from "@/lib/safeAction";
import { LaneCloseSchema } from "./schema";
import { _db } from "@/lib/db";

export const getHeatTimes = action(LaneCloseSchema, async input => {
  const race = await _db.races.findFirst({
    where: {
      id: input.race_id
    }
  });

  if (!race)
    throw new Error("Cannot find race.");

  const round = race.rounds.find(i => i.round_index === input.round_index)!;
  const participants = round.heats.find(i => i.index === input.heat_index)!.participants;


  return {
    participants
  }
})

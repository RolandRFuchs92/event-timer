"use server";

import { action } from "@/lib/safeAction";
import { HomePageFilterSchema } from "../schema";
import { _db } from "@/lib/db";
import { uniq } from "lodash";

export const getLaneRaceWinners = action(
  HomePageFilterSchema,
  async (input) => {
    const race = await _db.races.findFirst({
      where: {
        id: input.raceId,
      },
    });

    if (!race) throw new Error("Cannot find that race!");

    const laneRaceRounds = [...race.rounds].filter(
      (i) => i.is_qualifier === false,
    );
    laneRaceRounds.reverse();

    const [lastRound, secondLastRound] = laneRaceRounds;
    console.log(laneRaceRounds);

    const result = {
      secondLastRound:
        secondLastRound?.heats?.map((i) => {
          return {
            heat: `Heat ${i.index + 1}`,
            participants: i.participants.map((i) => {
              return {
                ...i,
              };
            }),
          };
        }) ?? [],
      lastRound:
        lastRound?.heats?.map((i) => {
          return {
            heat: `Heat ${i.index + 1}`,
            participants: i.participants.map((i) => {
              return {
                ...i,
              };
            }),
          };
        }) ?? [],
    };

    return result;
  },
);

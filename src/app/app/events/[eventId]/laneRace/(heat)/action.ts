"use server";

import { action } from "@/lib/safeAction";
import { HeatDeleteParticipantSchema } from "./schema";
import { _db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteHeatParticipant = action(
  HeatDeleteParticipantSchema,
  async (input) => {
    const race = (await _db.races.findFirst({
      where: {
        id: input.race_id,
      },
    }))!;

    const round = race.rounds.find((i) => input.round_index === i.round_index)!;
    const heat = round.heats.find((i) => input.heat_index === i.index);
    const participants = heat?.participants.filter(
      (i) => i.participant_id !== input.particpant_id,
    );

    await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              heats: {
                updateMany: {
                  data: {
                    participants: participants,
                  },
                  where: {
                    index: input.heat_index,
                  },
                },
              },
            },
            where: {
              round_index: input.round_index,
            },
          },
        },
      },
      where: {
        id: input.race_id,
      },
    });

    revalidatePath("");

    return {
      message: "Successfully removed that competitor",
    };
  },
);

"use server";

import { action } from "@/lib/safeAction";
import { ChangeRoundQualifierStatus } from "./schema";
import { _db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const changeRoundQualifierStatus = action(
  ChangeRoundQualifierStatus,
  async (input) => {
    const result = await _db.races.update({
      data: {
        rounds: {
          updateMany: {
            data: {
              is_qualifier: input.qualifer,
            },
            where: {
              round_index: input.roundIndex,
            },
          },
        },
      },
      where: {
        id: input.race_id,
      },
    });

    const roundType = input.qualifer ? "Qualifier" : "Versus";
    revalidatePath("");

    return {
      message: `Successfully changed round type to "${roundType}" mode`,
    };
  },
);

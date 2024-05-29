"use server";

import { _db } from "@/lib/db";
import { toMongoEpoch } from "@/lib/epochDate";
import { ParticipantHeatStatusEnum } from "@prisma/client";
import { mongoDeleteCommand } from "@/lib/mongoDeleteCommand";

interface UpdateParticipantTimeProps {
  raceId: string;
  roundIndex: number;
  heatIndex: number;
  participantIndex: number;
  finishTime: Date;
  timeMs: string;
  status: ParticipantHeatStatusEnum | null;
}

export async function updateParticipantTimeCommand(
  input: UpdateParticipantTimeProps,
) {
  try {
    await _db.$runCommandRaw({
      update: "races",
      updates: [
        {
          q: {
            _id: {
              $oid: input.raceId,
            },
          },
          u: {
            $set: {
              [`rounds.${input.roundIndex}.heats.${input.heatIndex}.participants.${input.participantIndex}.end_time`]:
                toMongoEpoch(input.finishTime),
              [`rounds.${input.roundIndex}.heats.${input.heatIndex}.participants.${input.participantIndex}.total_time_ms`]:
                input.timeMs,
              [`rounds.${input.roundIndex}.heats.${input.heatIndex}.participants.${input.participantIndex}.status`]:
                input.status,
            },
          },
        },
      ],
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

interface DeleteRoundCommandProps {
  raceId: string;
  roundIndexToRemove: number;
  oldIndexMaps: {
    indexPosition: number;
    newPropertyIndex: number;
  }[];
}

export async function deleteRoundCommand(input: DeleteRoundCommandProps) {
  try {
    const result = await _db.$runCommandRaw({
      update: "races",
      updates: [
        ...input.oldIndexMaps.map((i) => {
          return {
            q: {
              _id: {
                $oid: input.raceId,
              },
            },
            u: {
              $set: {
                [`rounds.${i.indexPosition}.round_index`]: i.newPropertyIndex,
              },
            },
          };
        }),
        {
          q: {
            _id: {
              $oid: input.raceId,
            },
          },
          u: [
            {
              $set: mongoDeleteCommand("rounds", input.roundIndexToRemove),
            },
          ],
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
}



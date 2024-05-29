"use server";

import { _db } from "@/lib/db";
import { toMongoEpoch } from "@/lib/epochDate";
import { ParticipantHeatStatusEnum } from "@prisma/client";

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
              $set: {
                rounds: {
                  $concatArrays: [
                    {
                      $slice: ["$rounds", input.roundIndexToRemove],
                    },
                    {
                      $slice: [
                        "$rounds",
                        {
                          $add: [1, input.roundIndexToRemove],
                        },
                        {
                          $size: "$rounds",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    });

    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

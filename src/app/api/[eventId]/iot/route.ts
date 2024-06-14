import { _db } from "@/lib/db";
import { differenceInMilliseconds, format } from "date-fns";
import { ParticipantHeatStatusEnum } from "@prisma/client";

import { IotSchema } from "./schema";


export const runtime = "edge";

interface IotGetParams {
  params: {
    eventId: string;
  };
}

export function GET(req: Request) {
  return Response.json({
    currentTime: Date.now().toString(),
  });
}

export async function POST(req: Request, { params }: IotGetParams) {
  const json = await req.json();
  const newData = {
    ...json,
    end_time: new Date(json.end_time),
  };
  const parsedData = IotSchema.safeParse(newData);
  console.log(JSON.stringify(parsedData, null, 2));

  if (!parsedData.success)
    return Response.json({
      message: "Invalid data provided.",
    });

  const input = parsedData.data!;

  const iotSettings = (await _db.iot.findFirst({
    where: {
      id: input.iot_id,
    },
  }))!;

  if (!iotSettings.race_id) {
    return Response.json({
      message: "Round data has not been set.",
    });
  }

  const buttonParticipantId =
    input.button_index === 0
      ? iotSettings.participant_a
      : iotSettings.participant_b;

  const race = (await _db.races.findFirst({
    where: {
      id: iotSettings.race_id!,
    },
  }))!;

  const round = race.rounds.find(
    (i) => i.round_index === iotSettings.round_index!,
  )!;
  const heat = round.heats.find((i) => i.index === iotSettings.heat_index)!;

  const competitor = heat.participants.find(
    (i) => i.participant_id !== buttonParticipantId,
  );

  let myStatus: ParticipantHeatStatusEnum = "Winner";
  if (competitor?.status === "Winner") myStatus = "RunnerUp";

  let heatIsClosed = !!competitor?.status;

  const totalTimeMs = differenceInMilliseconds(
    input.end_time,
    iotSettings.start_on!,
  );

  const participantData = {
    status: myStatus,
    total_time_ms: totalTimeMs.toString(),
    end_time: input.end_time,
  };

  await _db.races.update({
    data: {
      rounds: {
        updateMany: {
          data: {
            heats: {
              updateMany: {
                data: {
                  is_closed: heatIsClosed,
                  participants: {
                    updateMany: {
                      data: participantData,
                      where: {
                        participant_id: buttonParticipantId!,
                      },
                    },
                  },
                },
                where: {
                  index: iotSettings.heat_index!,
                },
              },
            },
          },
          where: {
            round_index: iotSettings.round_index!,
          },
        },
      },
    },
    where: {
      id: iotSettings!.race_id!,
    },
  });

  if (heatIsClosed) await unloadIotRound(input.iot_id);

  return Response.json({
    result: participantData,
    message: "Buzzer data capture successful.",
  });
}

async function unloadIotRound(iotId: string) {
  await _db.iot.update({
    data: {
      race_id: null,
      event_id: null,
      start_on: null,
      heat_index: null,
      round_index: null,
      participant_a: null,
      participant_b: null,
    },
    where: {
      id: iotId,
    },
  });
}

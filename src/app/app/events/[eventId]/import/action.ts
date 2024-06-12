"use server";

import { parseString } from "fast-csv";
import { _db } from "@/lib/db";
import { participant, races } from "@prisma/client";
import { HeadingsType } from "@/app/api/csvTemplate/route";

interface ActionResponse<T> {
  result: T;
  serverError: string;
}

export async function importCsv(
  form: FormData,
): Promise<ActionResponse<{ message: string }>> {
  const input = {
    csv_file: form.get("csv_file") as File,
    event_id: form.get("event_id")!.toString(),
    separator: form.get("separator")!.toString(),
  };

  const csvFile = await input.csv_file.text();
  const event = await _db.event.findFirst({
    include: {
      races: true,
    },
    where: {
      id: input.event_id?.toString()!,
    },
  });

  if (!event) {
    return {
      result: { message: "" },
      serverError: "Unable to find that event.",
    };
  }

  let itteration = event.last_race_number;
  // const isAutoRaceNumber = group.is_auto_race_number;

  const rawParsedData: HeadingsType[] = [];
  await new Promise(async (res) => {
    parseString(csvFile, { headers: true, delimiter: input.separator || "," })
      .on("data", (row: HeadingsType) => {
        itteration++;
        rawParsedData.push({
          ...row,
          race_number: itteration.toString(),
        });
      })
      .on("end", () => {
        res(true);
      });
  });

  console.log(rawParsedData)

  const participantData = rawParsedData.reduce(
    (acc, cur) => {
      const key = `${cur.first_name}-${cur.last_name}`;
      const isIncAcc = key in acc;
      const thisRace = event.races.find((i) => i.id === cur.race_id);

      if (!thisRace) return acc as any;

      if (isIncAcc) {
        acc[key].races.push({
          race_id: cur.race_id,
          race_type: thisRace.race_type,
          race_name: thisRace.name,
          batch_index: +cur.batch_index,
        });
        return acc;
      }

      return {
        ...acc,
        [key]: {
          first_name: cur.first_name,
          last_name: cur.last_name,
          email: cur.email,
          birthdate: new Date(cur.birthdate),
          race_number: cur.race_number.toString(),
          is_male: /true/i.test(cur.is_male),
          event_id: input.event_id,
          races: [
            {
              race_id: cur.race_id,
              race_type: thisRace.race_type,
              race_name: thisRace.name,
              batch_index: +cur.batch_index,
            },
          ],
        },
      };
    },
    {} as { [key: string]: participant },
  );

  try {
    await resetRaceData(input.event_id);
    const participants = Object.values(participantData);
    const result = await _db.participant.createMany({
      data: participants,
    });

    const allNewParticipants = await _db.participant.findMany({
      where: {
        race_number: {
          in: participants.map((i) => i.race_number!),
        },
      },
    });


    for (const race of event.races) {
      const participantsOfThisRace = allNewParticipants.filter((i) =>
        i.races.some((r) => r.race_id === race.id),
      );
      if (race.race_type === "LaneRace")
        await _db.races.update({
          data: {
            rounds: {
              updateMany: {
                data: {
                  all_participant_ids: {
                    push: participantsOfThisRace.map((i) => i.id),
                  },
                },
                where: {
                  round_index: 0,
                },
              },
            },
          },
          where: {
            id: race.id,
            race_type: "LaneRace",
          },
        });

      if (race.race_type === "StandardNoLaps") {
        await assignParticipantsToRelativeBatch(race, participantsOfThisRace);
      }
    }

    return {
      result: {
        message: `Successfully imported ${allNewParticipants.length} participants!`,
      },
      serverError: "",
    };
  } catch (error: any) {
    console.log(error);
    return {
      result: {
        message: "",
      },
      serverError: "There was an error importing your data.",
    };
  }
}

async function assignParticipantsToRelativeBatch(
  race: races,
  participants: participant[],
) {
  for (const batch of race.batches) {
    const batchParticipants = participants.filter((p) => {
      const isInThisBatch = p.races.some(
        (i) => i.race_id === race.id && i.batch_index === batch.index,
      );
      return isInThisBatch;
    });

    await _db.races.update({
      data: {
        batches: {
          updateMany: {
            data: {
              participants: {
                push: batchParticipants.map((i) => ({
                  time_taken: null,
                  finish_time: null,
                  participant_id: i.id,
                  finish_status: null,
                  time_taken_ms: null,
                })),
              },
            },
            where: {
              index: batch.index,
            },
          },
        },
      },
      where: {
        id: race.id,
        race_type: "StandardNoLaps",
      },
    });
  }
}

async function resetRaceData(eventId: string) {
  await _db.races.updateMany({
    data: {
      rounds: {
        updateMany: {
          data: {
            all_participant_ids: [],
          },
          where: {},
        },
      },
      batches: {
        updateMany: {
          where: {},
          data: {
            participants: [],
          },
        },
      },
    },
    where: {
      event_id: eventId,
    },
  });

  await _db.participant.deleteMany({
    where: {
      event_id: eventId,
    },
  });
}

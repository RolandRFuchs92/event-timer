import { action } from "@/lib/safeAction";
import { CsvUploadSchema } from "./schema";

export const importCsv = action(CsvUploadSchema, async input => {
  const base64FileUrl = input.base64Url;
  const fileData = base64FileUrl
  // const separator = formData.get("separator")?.toString();

  // const group = await _db.event_group.findFirst({
  //     select: {
  //         id: true,
  //         is_auto_race_number: true,
  //         race_number_increment: true
  //     },
  //     where: {
  //         id: eventGroupId
  //     }
  // });
  //
  // if (!group) {
  //     return {
  //         message: "Cannot find that group."
  //     }
  // }
  //
  // let itteration = group.race_number_increment || 0;
  // const isAutoRaceNumber = group.is_auto_race_number;
  //
  // const dataToUpload: participant[] = []
  // await new Promise(async res => {
  //     parseString(await fileData.text(), { headers: true, delimiter: separator || "," })
  //         .on('data', (row: HeadingsType) => {
  //             if (isAutoRaceNumber)
  //                 itteration++;
  //
  //             const data: Omit<participant, 'id'> = {
  //                 birthdate: new Date(row.birthdate),
  //                 has_paid: row.has_paid.toLowerCase() === "true",
  //                 is_male: row.is_male.toLowerCase() === "true",
  //                 event_batch_id: +row.event_batch_id,
  //                 race_number: isAutoRaceNumber ? itteration.toString() : row.race_number,
  //                 is_dnf: false,
  //                 last_name: row.last_name,
  //                 first_name: row.first_name,
  //                 finish_time: null
  //             }
  //
  //             dataToUpload.push(data as any);
  //         })
  //         .on('end', () => {
  //             res(true)
  //         });
  // });
  //
  // if (!dataToUpload.length) {
  //     return {
  //         message: "Nothing uploaded."
  //     }
  // }
  // try {
  //     const [result,] = await _db.$transaction([
  //         _db.participant.createMany({
  //             data: dataToUpload
  //         }),
  //         _db.event_group.update({
  //             data: {
  //                 race_number_increment: itteration
  //             },
  //             where: {
  //                 id: group.id
  //             }
  //         })
  //     ]);
  //
  //     return {
  //         message: `Successfully uploaded ${result.count} participants`
  //     }
  // } catch (error: any) {
  //     return {
  //         message: error.message
  //     }
  // }
  //

}

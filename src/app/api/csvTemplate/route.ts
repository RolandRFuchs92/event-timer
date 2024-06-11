
import { writeToString } from "@fast-csv/format";
import { NextResponse } from "next/server";

export async function GET() {
  const z = await writeToString([Object.keys(headings)]);

  const response = new NextResponse(z, {
    status: 200,
    headers: new Headers({
      "content-disposition": `attachment; filename=participants.csv`, //State that this is a file attachment
      "content-type": "application/csv", //Set the file type to an iso
      "content-length": z.length + "",
    }),
  });

  return response;
}

export type HeadingsType = { [key in keyof typeof headings]: string };

const headings = {
  first_name: null,
  last_name: null,
  birthdate: null,
  email: null,
  race_number: null,
  has_paid: null,
  is_male: null,
  event_batch_id: null,
  race_ids: null,
};

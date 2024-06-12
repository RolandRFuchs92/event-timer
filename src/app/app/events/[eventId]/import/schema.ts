import z from "zod";

export const CsvUploadSchema = z.object({
  csv_file: z.any(),
  event_id: z.string(),
  separator: z.string(),
});

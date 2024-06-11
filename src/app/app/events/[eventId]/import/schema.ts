import z from 'zod';

export const CsvUploadSchema = z.object({
  base64Url: z.string(),
  event_id: z.string(),
  separator: z.string()
});

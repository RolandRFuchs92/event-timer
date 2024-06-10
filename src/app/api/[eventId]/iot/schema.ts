import z from "zod";

export const IotSchema = z.object({
  iot_id: z.string(),
  button_index: z.number(),
  end_time: z.coerce.date(),
});

import z from "zod";

export const FinisherFilterSchema = z.object({
  raceId: z.string(),
  refresh: z.coerce.number(),
  qualifier: z.coerce.boolean().default(false),
});

export const defaultFinisherUrlParams = new URLSearchParams();
defaultFinisherUrlParams.set("raceId", "");
defaultFinisherUrlParams.set("refresh", "5");
defaultFinisherUrlParams.set("qualifier", "false");

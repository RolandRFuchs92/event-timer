"use client";

import { MONGO_UPSERT_HACK } from "@/lib/db";
import z from "zod";

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  credits: z.coerce.number(),
  account_id: z.string(),
});

export const DefaultClient: z.infer<typeof clientSchema> = {
  id: MONGO_UPSERT_HACK,
  name: "",
  credits: 0,
  account_id: "",
};

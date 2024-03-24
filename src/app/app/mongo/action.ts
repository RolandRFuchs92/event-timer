"use server";

import z from "zod";

import { _db } from "@/lib/db";

import { someForm } from "./schema";

export async function createNewEntry(data: z.infer<typeof someForm>) {
  const result = await _db.account.create({
    data: {
      ...data,
    },
  });

  return {
    message: "Success!",
    result,
  };
}

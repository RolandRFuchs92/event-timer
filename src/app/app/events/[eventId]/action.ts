"use server";

import { _db } from "@/lib/db";
import { DefaultEvent } from "./schema";

export async function getEvent(eventId: string) {
  if (eventId === "null") return DefaultEvent;

  const result = await _db.event.findFirst({
    where: {
      id: eventId,
    },
  });

  if (!result) return DefaultEvent;

  return result;
}

export async function mutateEvent(event: typeof DefaultEvent) {
  console.log("CHANGING SHIT");
  console.log(event);

  return {
    result: event,
    message: "Successfully set event!",
  };
}

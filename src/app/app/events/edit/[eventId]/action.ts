"use server";

import { _db } from "@/lib/db";
import { DefaultEvent } from "./schema";
import { mongoEnumToOptions, optionsToStringArray } from "@/lib/helper";
import { revalidatePath, unstable_noStore } from "next/cache";
import { event } from "@prisma/client";

export async function getEvent(eventId: string) {
  if (eventId === "null") return DefaultEvent;

  unstable_noStore();
  const rawResult = await _db.event.findFirst({
    where: {
      id: eventId,
    },
  });

  if (!rawResult) return DefaultEvent;

  const result = {
    ...rawResult,
    event_type: mongoEnumToOptions(rawResult.event_type),
  };

  return result;
}

export async function mutateEvent({
  id,
  ...initialEvent
}: typeof DefaultEvent) {
  const event: Omit<event, "id"> = {
    ...initialEvent,
    event_type: initialEvent.event_type.map((i) =>
      optionsToStringArray(i),
    ) as any,
  };

  const result = await _db.event.upsert({
    create: event,
    update: event,
    where: {
      id,
    },
  });
  revalidatePath("/app/events");

  return {
    result,
    message: "Successfully set event!",
  };
}

export async function getClientOptions() {
  unstable_noStore();
  const clientOptions = await _db.client.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const result = clientOptions.map((i) => ({
    value: i.id,
    label: i.name,
  }));

  return result;
}

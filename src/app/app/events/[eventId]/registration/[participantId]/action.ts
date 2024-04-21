import { _db } from "@/lib/db";

export async function mutateParticipant(data: any) {
  return {
    message: "Registration was successful.",
  };
}

export async function getEventRaces(eventId: string) {
  const races = await _db.races.findMany({
    where: {
      event_id: eventId,
    },
  });

  return races;
}

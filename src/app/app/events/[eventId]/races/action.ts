"use server";

export async function deleteRace(id: string) {
  return {
    message: `Successfully deleted that race.`,
  };
}

export async function getEventRaces() {}

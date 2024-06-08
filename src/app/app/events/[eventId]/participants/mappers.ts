import { RaceTypeEnum, races } from '@prisma/client'

type ParticipantRaceBatches = {
  race_name: string,
  batch: string | null,
  race_type: RaceTypeEnum
}

export function mapRacesAndBatches(participantId: string, races: races[]): ParticipantRaceBatches[] {
  const relatedBatches = races.reduce((acc, cur) => {

    const batch = cur.batches.find(i => {
      return i.participants.some(p => p.participant_id === participantId);
    });

    if (cur.race_type === "LaneRace")
      return [
        ...acc,
        {
          race_type: cur.race_type,
          batch: null,
          race_name: cur.name
        }
      ];

    if (batch)
      return [
        ...acc,
        {
          race_type: cur.race_type,
          batch: batch.name,
          race_name: cur.name
        } as ParticipantRaceBatches
      ];

    return acc;
  }, [] as ParticipantRaceBatches[]);

  return relatedBatches;
}

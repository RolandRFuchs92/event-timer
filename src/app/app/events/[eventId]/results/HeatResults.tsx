import { ParticipantHeatStatusEnum } from "@prisma/client";

type HeatResultsType = {
  input: {
    heatNumber: number;
    isClosed: boolean;
    participants: {
      name: string;
      status: ParticipantHeatStatusEnum | null;
      timeTakedMs: string | null;
    }[];
  };
};
export function HeatResults() {
  return <div>1234</div>;
}

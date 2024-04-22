import { ParticipantTable } from "./ParticipantTable";
import { getParticipants } from "./action";

interface ParticipantsPageProps {
  params: {
    participantId: string;
    eventId: string;
  };
}

export default async function ParticipantsPage({
  params,
}: ParticipantsPageProps) {
  const data = await getParticipants(params.eventId);
  return <ParticipantTable data={data} />;
}

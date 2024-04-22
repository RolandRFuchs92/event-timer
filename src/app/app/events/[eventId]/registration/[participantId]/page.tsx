import { RegistrationForm } from "./RegistrationForm";
import { getEventRaces, getParticipant } from "./action";

interface ParticipantPageprops {
  params: {
    eventId: string;
    participantId: string;
  };
}

export default async function RegistrationPage({
  params,
}: ParticipantPageprops) {
  const participant = await getParticipant(
    params.eventId,
    params.participantId,
  );
  const races = await getEventRaces(params.eventId);
  return <RegistrationForm races={races} participant={participant} />;
}

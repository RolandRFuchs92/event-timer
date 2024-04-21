import { RegistrationForm } from "./RegistrationForm";
import { getEventRaces } from "./action";

interface ParticipantPageprops {
  params: {
    eventId: string;
  };
}

export default async function ParticipantPage({
  params,
}: ParticipantPageprops) {
  const races = await getEventRaces(params.eventId);
  return <RegistrationForm races={races} />;
}

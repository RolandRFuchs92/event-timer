import { EventTable } from "./EventTable";
import { getEvents } from "./action";

export default async function EventsPage() {
  const data = await getEvents();

  return <EventTable data={data} />;
}

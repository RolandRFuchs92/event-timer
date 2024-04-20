import React from "react";
import { EventForm } from "./EventForm";
import { getClientOptions, getEvent } from "./action";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.eventId);
  const clients = await getClientOptions();
  return <EventForm event={event} clients={clients} />;
}

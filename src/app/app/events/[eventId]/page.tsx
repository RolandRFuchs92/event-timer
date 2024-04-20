import React from "react";
import { EventForm } from "./EventForm";
import { getEvent } from "./action";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.eventId);
  return <EventForm event={event} />;
}

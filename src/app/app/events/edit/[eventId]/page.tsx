import React from "react";
import { EventForm } from "./EventForm";
import { getClientOptions, getEvent } from "./action";
import { enumToOptions } from "@/lib/helper";
import { EventTypeEnum } from "@prisma/client";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.eventId);
  const clients = await getClientOptions();
  const opts = enumToOptions(EventTypeEnum);

  return <EventForm event={event} clients={clients} opts={opts} />;
}

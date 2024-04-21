interface EventHomeProps {
  params: {
    eventId: string;
  };
}

export default async function EventHome({ params }: EventHomeProps) {
  return <h1>Event home {params.eventId}</h1>;
}

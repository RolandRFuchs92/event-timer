import React from "react";

import { RaceLegend } from "./RaceLegend";
import { RaceImportForm } from "./RaceImportForm";

interface ImportPageProps {
  params: {
    eventId: string;
  };
}

export default function ImportPage({ params }: ImportPageProps) {
  return (
    <div className="grid gap-2 grid-cols-2">
      <RaceImportForm />
      <RaceLegend eventId={params.eventId} />
    </div>
  );
}

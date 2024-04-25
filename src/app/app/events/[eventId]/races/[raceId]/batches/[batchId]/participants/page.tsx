import { LinkButton } from "@/components/FormElements/button";
import React from "react";

export default async function Participants() {
  return (
    <div>
      <h1>Participants</h1>
      <LinkButton label="Batches" href="batch" />
    </div>
  );
}

"use client";

import { ParticipantHeatStatusEnum } from "@prisma/client";

export const CustomParticipantHeatStatusEnum: {
  value: string;
  label: string;
}[] = [
    {
      value: ParticipantHeatStatusEnum.Winner,
      label: ParticipantHeatStatusEnum.Winner,
    },
    {
      value: ParticipantHeatStatusEnum.RunnerUp,
      label: ParticipantHeatStatusEnum.RunnerUp,
    },
    {
      value: ParticipantHeatStatusEnum.NotStarted,
      label: ParticipantHeatStatusEnum.NotStarted,
    },
    {
      value: ParticipantHeatStatusEnum.DidNotFinish,
      label: ParticipantHeatStatusEnum.DidNotFinish,
    },
    {
      value: ParticipantHeatStatusEnum.Disqualified,
      label: ParticipantHeatStatusEnum.Disqualified
    },
  ];

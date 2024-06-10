import TwDialog from '@/components/Dialog/Dialog';
import { Button } from '@/components/FormElements/button';
import React from 'react';
import { deleteHeatParticipant } from './action';
import { useLaneRaceId } from '../hook';
import toast from 'react-hot-toast';

interface HeatDeleteParticipant {
  particpant_id: string,
  round_index: number,
  heat_index: number
}

export function HeatDeleteParticipant({ particpant_id, round_index, heat_index }: HeatDeleteParticipant) {
  const raceId = useLaneRaceId();

  const handleDeleteParticiant = async () => {
    const result = await deleteHeatParticipant({
      heat_index: heat_index,
      round_index: round_index,
      particpant_id: particpant_id,
      race_id: raceId
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
  }

  return <TwDialog
    title={"Really do dis ting?"}
    body={"U sur?"}
    onYes={handleDeleteParticiant}>
    {(setData, toggle) => {
      return <Button
        label="Delete"
        onClick={() => {
          setData({});
          toggle();
        }}
      />
    }}</TwDialog>
}


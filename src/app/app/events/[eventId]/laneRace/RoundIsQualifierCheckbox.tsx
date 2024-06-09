"use client";
import React from "react";

import { StandardCheckbox } from "@/components/Checkboxes/CheckboxOne";

import { useLaneRaceId, useRoundIndex } from "./hook";
import { changeRoundQualifierStatus } from "./roundIsQualifierCheckboxAction";
import toast from "react-hot-toast";

interface RoundIsQualifierCheckboxProps {
  isQualifier: boolean;
}

export function RoundIsQualifierCheckbox({
  isQualifier,
}: RoundIsQualifierCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(isQualifier);
  const raceId = useLaneRaceId();
  const roundIndex = useRoundIndex();

  if (isQualifier !== isChecked) {
    setIsChecked(isQualifier);
  }

  const handleCheck = async (checked: boolean) => {
    const result = await changeRoundQualifierStatus({
      qualifer: checked,
      roundIndex: roundIndex,
      race_id: raceId,
    });

    if (result.serverError) {
      toast.error(result.serverError);
      return;
    }

    toast.success(result.data!.message);
    setIsChecked(checked);
  };

  return (
    <StandardCheckbox
      label="Is Qualifier"
      name="isQualifier"
      checked={isChecked}
      onChange={({ currentTarget: { checked } }) => {
        handleCheck(checked);
      }}
    />
  );
}

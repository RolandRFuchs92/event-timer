"use client";
import React from "react";

import { addHours, differenceInSeconds } from "date-fns";
import { timeOnly } from "@/lib/DateTimeUtils";

type BatchElapsedTimeProps = {
  startTime: Date | null;
};

export function BatchElapsedTime({ startTime }: BatchElapsedTimeProps) {
  const [time, setTime] = React.useState("0");

  React.useEffect(() => {
    if (!startTime) return;
    const handleTimeSet = () => {
      const now = new Date();
      const diff = differenceInSeconds(now, startTime);
      const newTime = timeOnly(addHours(new Date(1000 * diff), -2));
      setTime(newTime);
    };
    handleTimeSet();

    const interval = setInterval(() => {
      handleTimeSet();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return time;
}

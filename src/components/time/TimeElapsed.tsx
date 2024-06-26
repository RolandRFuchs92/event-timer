"use client";
import React from "react";

import { addHours, differenceInSeconds } from "date-fns";
import { timeOnly } from "@/lib/DateTimeUtils";

type BatchElapsedTimeProps = {
  startTime: Date | null;
};

const msg = "Not started";

export function BatchElapsedTime({ startTime }: BatchElapsedTimeProps) {
  const [time, setTime] = React.useState(msg);

  React.useEffect(() => {
    if (!startTime) {
      setTime(msg);
      return;
    }

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

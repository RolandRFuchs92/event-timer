"use client";
import { timeOnly } from "@/lib/DateTimeUtils";
import React from "react";

export function CurrentTime() {
  const [time, setTime] = React.useState(timeOnly(new Date(0)));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeOnly(new Date()));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return time;
}

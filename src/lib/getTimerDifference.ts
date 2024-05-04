import { differenceInMilliseconds } from "date-fns";

export function getTimerDifference(startTime: Date, endTime: Date) {
  const diffMilliSeconds = differenceInMilliseconds(endTime, startTime);
  const diffSeconds = Math.floor(diffMilliSeconds / 1000);

  const milliSeconds = diffMilliSeconds % 1000;
  const seconds = diffSeconds % 60;
  const minutes = Math.floor(diffSeconds / 60) % 60;
  const hours = Math.floor(diffSeconds / 3600);

  const pad = (value: number, symbol: string, len: number = 2) =>
    !value ? "" : `${value.toString().padStart(len, "0")}${symbol}`;

  return `${pad(hours, "h")}${pad(minutes, "m")}${pad(seconds, "s")}${pad(milliSeconds, "ms")}`;
}

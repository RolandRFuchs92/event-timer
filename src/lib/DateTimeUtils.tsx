"use client";

import { format, differenceInMilliseconds } from "date-fns";

export function timeOnly(date: Date) {
  return format(date, "HH:mm:ss");
}

export function fullDateFormat(date: Date | null) {
  if (date === null) return "No Date";
  return format(date, "dd MMM yyyy HH:mm:ss");
}

export function shortDateFormat(date: Date) {
  return format(date, "dd-MMM-yyyy");
}

export function defaultDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function defaultDateTimetring(date: Date) {
  const res = format(date, "yyyy-MM-dd'T'HH:mm");
  return res;
}

export function invoiceNumber() {
  return format(new Date(), "yyMMdd-HHmmss");
}

export function getTimerDifference(startTime: Date, endTime: Date) {
  const diffMilliSeconds = differenceInMilliseconds(endTime, startTime);
  const diffSeconds = Math.floor(diffMilliSeconds / 1000);

  const milliSeconds = diffMilliSeconds % 1000;
  const seconds = diffSeconds % 60;
  const minutes = Math.floor(diffSeconds / 60) % 60;
  const hours = Math.floor(diffSeconds / 3600);

  const pad = (value: number, len = 2) => value.toString().padStart(len, "0");

  return [pad(hours), pad(minutes), pad(seconds), pad(milliSeconds, 3)].join(
    ":",
  );
}

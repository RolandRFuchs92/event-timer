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
  const res = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
  return res;
}

export function invoiceNumber() {
  return format(new Date(), "yyMMdd-HHmmss");
}

"use client";

import { ClassNameValue } from "tailwind-merge";
import { format } from "date-fns";

interface TimeProps {
  dateTime?: Date | null;
  className?: string;
  format: "yyyy-MM-dd'T'HH:mm" | "dd MMM yyyy HH:mm:ss" | "HH:mm:ss";
}

export function Time({ dateTime, className, format: dateFormat }: TimeProps) {
  if (!dateTime) return <p>No data</p>;

  return <span className={className}>{format(dateTime, dateFormat)}</span>;
}

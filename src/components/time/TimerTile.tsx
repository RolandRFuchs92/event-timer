import { cn } from "@/lib/styles";
import clsx from "clsx";

type TimerDisplayProps = {
  label: string;
  time: React.ReactNode;
  color: string;
};

export function TimerDisplay({ label, time, color }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "flex grow flex-row items-center justify-between rounded-md bg-blue-300 p-2 text-3xl ",
        color,
      )}
    >
      <h3>{label}</h3> {time}
    </div>
  );
}

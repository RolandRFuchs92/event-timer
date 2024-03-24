import { cn } from "@/lib/styles";
import React from "react";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function Button({
  label,
  type = "submit",
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      className={cn(
        "flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90",
        className,
      )}
      type={type}
      {...props}
    >
      Save
    </button>
  );
}

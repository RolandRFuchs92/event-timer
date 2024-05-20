import { cn } from "@/lib/styles";
import Link from "next/link";
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
        "flex justify-center items-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-black disabled:text-blue-200 ",
        className,
      )}
      type={type}
      {...props}
    >
      {label}
    </button>
  );
}

type LinkProps = Parameters<typeof Link>[0];
interface LinkButtonProps extends LinkProps {
  label: string;
  className?: string;
  href: string;
}

export function LinkButton({
  label,
  href,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-black",
        className,
      )}
      {...props}
    >
      {label}
    </Link>
  );
}

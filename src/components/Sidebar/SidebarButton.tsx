"use client";

import { cn } from "@/lib/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarButtonProps extends React.ComponentProps<typeof Link> {
  label: string;
  frontIcon?: React.ReactNode;
  backIcon?: React.ReactNode;
}

export function SidebarButton({
  label,
  href,
  frontIcon,
  backIcon,
  className,
  ...props
}: SidebarButtonProps) {
  const pathname = usePathname();
  const highlight = pathname.includes(href.toString())
    ? "bg-graydark dark:bg-meta-4"
    : "";

  return (
    <li>
      <Link
        href={href}
        className={cn(
          `group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`,
          highlight,
          className,
        )}
        {...props}
      >
        {frontIcon}
        {label}
        {backIcon}
      </Link>
    </li>
  );
}

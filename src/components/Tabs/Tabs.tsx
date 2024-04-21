"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/styles";
import { usePathname } from "next/navigation";

interface TabProps {
  options: {
    text: string;
    Icon: React.ReactNode;
    linkProps: React.ComponentProps<typeof Link>;
    exactMatch?: boolean;
  }[];
}

export function Tabs({ options }: TabProps) {
  const pathname = usePathname();

  return (
    <div className="border-gray-200 dark:border-gray-700 border-b">
      <ul className="text-gray-500 dark:text-gray-400 -mb-px flex flex-wrap text-center text-sm font-medium">
        {options.map(
          ({
            exactMatch,
            text,
            Icon,
            linkProps: { className, ...linkProps },
          }) => {
            const isSelected =
              ((!exactMatch &&
                pathname.includes(linkProps.href as any as string)) ||
                (exactMatch && pathname === linkProps.href)) &&
              linkProps.href !== "";

            return (
              <Link
                key={text}
                className={cn(
                  "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-transparent p-4 hover:bg-blue-100",
                  className,
                  isSelected ? "bg-blue-200" : "",
                )}
                {...linkProps}
              >
                {Icon}
                {text}
              </Link>
            );
          },
        )}
      </ul>
    </div>
  );
}

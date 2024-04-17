"use client";

import React, { ReactNode, useState } from "react";
import { SidebarChevronButton } from "./SidebarChevronButton";
import { usePathname } from "next/navigation";

interface SidebarLinkGroupProps {
  label: string;
  pathMatch: string;
  children: (handleClick: () => void, open: boolean) => ReactNode;
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarLinkGroup = ({
  children,
  label,
  pathMatch,
  sidebarExpanded,
  setSidebarExpanded,
}: SidebarLinkGroupProps) => {
  const pathname = usePathname();
  const activeCondition = pathname.includes(pathMatch);

  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li>
      {
        <SidebarChevronButton
          handleClick={handleClick}
          open={open}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          label={label}
          pathMatch={pathMatch}
        />
      }

      {open ? children(handleClick, open) : null}
    </li>
  );
};

export default SidebarLinkGroup;

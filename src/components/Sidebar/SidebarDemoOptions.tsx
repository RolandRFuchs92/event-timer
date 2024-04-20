"use client";
import React from "react";
import Link from "next/link";

import SidebarLinkGroup from "./SidebarLinkGroup";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { FormIcon } from "../Icons/FormIcon";
import { ChartIcon } from "../Icons/ChartIcon";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { TableIcon } from "../Icons/TableIcon";
import { usePathname } from "next/navigation";
import { MyProfileIcon } from "../Icons/MyProfileIcon";

export function SidebarDemoOptions() {
  const pathname = usePathname();
  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = React.useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  return (
    <SidebarLinkGroup
      label="Page Demos"
      pathMatch="app/pageDemo"
      sidebarExpanded={sidebarExpanded}
      setSidebarExpanded={setSidebarExpanded}
    >
      {(handleClick, open) => {
        return (
          <>
            <Link
              href="/app/pageDemos/profile"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                pathname.includes("profile") && "bg-graydark dark:bg-meta-4"
              }`}
            >
              <MyProfileIcon />
              Profile
            </Link>
            <Link
              href="/app/pageDemos/calendar"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-graydark dark:bg-meta-4"
              }`}
            >
              <CalendarIcon />
              Calendar
            </Link>

            <SidebarLinkGroup
              label="Forms"
              pathMatch="app/pageDemo/form"
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
            >
              {(handleClick, open) => {
                return (
                  <>
                    <Link
                      href="/app/pageDemos/forms/form-elements"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <FormIcon />
                      Form Elements
                    </Link>

                    <Link
                      href="/app/pageDemos/forms/form-layout"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <FormIcon />
                      Form Layout
                    </Link>
                  </>
                );
              }}
            </SidebarLinkGroup>
            <Link
              href="/app/pageDemos/chart"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-graydark dark:bg-meta-4"
              }`}
            >
              <ChartIcon />
              Chart
            </Link>

            <Link
              href="/app/pageDemos/settings"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-graydark dark:bg-meta-4"
              }`}
            >
              <SettingsIcon />
              Settings
            </Link>

            <Link
              href="/app/pageDemos/tables"
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === "/" || pathname.includes("dashboard")) &&
                "bg-graydark dark:bg-meta-4"
              }`}
            >
              <TableIcon />
              Tables
            </Link>

            <SidebarLinkGroup
              label="Ui"
              pathMatch="app/pageDemo/ui"
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
            >
              {(handleClick, open) => {
                return (
                  <>
                    <Link
                      href="/app/pageDemos/ui/alerts"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      Alerts
                    </Link>
                    <Link
                      href="/app/pageDemos/ui/buttons"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <SettingsIcon />
                      Buttons
                    </Link>
                  </>
                );
              }}
            </SidebarLinkGroup>
            <SidebarLinkGroup
              label="Auth"
              pathMatch="app/pageDemo/auth"
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
            >
              {(handleClick, open) => {
                return (
                  <>
                    <Link
                      href="/app/pageDemos/auth/signin"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <LogoutIcon />
                      Sign In
                    </Link>
                    <Link
                      href="/app/pageDemos/auth/signup"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/" || pathname.includes("dashboard")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      <LogoutIcon />
                      Sign Up
                    </Link>
                  </>
                );
              }}
            </SidebarLinkGroup>
          </>
        );
      }}
    </SidebarLinkGroup>
  );
}

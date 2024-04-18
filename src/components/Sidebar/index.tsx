"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { MyProfileIcon } from "../Icons/MyProfileIcon";
import { SidebarChevronButton } from "./SidebarChevronButton";
import { FormIcon } from "../Icons/FormIcon";
import { ChartIcon } from "../Icons/ChartIcon";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { TableIcon } from "../Icons/TableIcon";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { SidebarButton } from "./SidebarButton";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image
            width={176}
            height={32}
            src={"/images/logo/logo.svg"}
            alt="Logo"
            priority
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarButton
                label={"Accounts"}
                href="/app/accounts"
                frontIcon={<MyProfileIcon />}
              />
              <SidebarButton
                label={"Clients"}
                href="/app/clients"
                frontIcon={<MyProfileIcon />}
              />
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
                          pathname.includes("profile") &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                      >
                        <MyProfileIcon />
                        Profile
                      </Link>
                      <Link
                        href="/app/pageDemos/calendar"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/" ||
                            pathname.includes("dashboard")) &&
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
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
                                  "bg-graydark dark:bg-meta-4"
                                }`}
                              >
                                <FormIcon />
                                Form Elements
                              </Link>

                              <Link
                                href="/app/pageDemos/forms/form-layout"
                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
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
                          (pathname === "/" ||
                            pathname.includes("dashboard")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                      >
                        <ChartIcon />
                        Chart
                      </Link>

                      <Link
                        href="/app/pageDemos/settings"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/" ||
                            pathname.includes("dashboard")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                      >
                        <SettingsIcon />
                        Settings
                      </Link>

                      <Link
                        href="/app/pageDemos/tables"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/" ||
                            pathname.includes("dashboard")) &&
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
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
                                  "bg-graydark dark:bg-meta-4"
                                }`}
                              >
                                Alerts
                              </Link>
                              <Link
                                href="/app/pageDemos/ui/buttons"
                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
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
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
                                  "bg-graydark dark:bg-meta-4"
                                }`}
                              >
                                <LogoutIcon />
                                Sign In
                              </Link>
                              <Link
                                href="/app/pageDemos/auth/signup"
                                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                  (pathname === "/" ||
                                    pathname.includes("dashboard")) &&
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
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;

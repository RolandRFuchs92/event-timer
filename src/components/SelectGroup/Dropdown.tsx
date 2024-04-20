"use client";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

interface DropdownProps<T>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: T[];
  label: string;
  icon?: React.ReactNode;
  getKey?: T extends object ? (i: T) => string : undefined;
  getValue?: T extends object ? (i: T) => string : undefined;
}

export function Dropdown<T>({
  options,
  getKey,
  getValue,
  label,
  icon = null,
  name,
  ...props
}: DropdownProps<T>) {
  return (
    <Controller
      name={name!}
      render={({ field, fieldState }) => {
        return (
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              {label}
            </label>

            <div className="relative z-20 bg-white dark:bg-form-input">
              <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                {icon}
              </span>

              <select
                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input`}
                value={field.value}
                onChange={field.onChange}
                {...props}
              >
                <option
                  value=""
                  disabled
                  className="text-body dark:text-bodydark"
                >
                  {label}
                </option>
                {options.map((i) => {
                  const key =
                    typeof i === "object" ? getKey!(i) : (i as string);
                  const value =
                    typeof i === "object" ? getValue!(i) : (i as string);

                  return (
                    <option
                      value={key}
                      className="text-body dark:text-bodydark"
                      key={key}
                    >
                      {value}
                    </option>
                  );
                })}
              </select>

              <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}

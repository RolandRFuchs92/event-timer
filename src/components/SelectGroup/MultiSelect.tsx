"use client";
import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { Options } from "react-tailwindcss-select/dist/components/type";

interface MultiSelectProps<T>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: T[];
  label: string;
  name: string;
  icon?: React.ReactNode;
  getKey?: T extends object ? (i: T) => string : undefined;
  getLabel?: T extends object ? (i: T) => string : undefined;
}

export function MultiSelect<T>({
  options,
  label,
  icon,
  getKey,
  getLabel,
  name,
  ...props
}: MultiSelectProps<T>) {

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        return (
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              {label}
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <Select
                primaryColor="indigo"
                options={options as Options}
                onChange={(i) => field.onChange(i)}
                isClearable
                isMultiple
                value={field.value || null}
              />
              <sub>{fieldState.error?.message}</sub>
            </div>
          </div>
        );
      }}
    />
  );
}

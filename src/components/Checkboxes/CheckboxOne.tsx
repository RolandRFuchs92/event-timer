"use client";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import { Controller } from "react-hook-form";

interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string;
  label: string;
}

export function Checkbox({ name, label, ...props }: CheckboxProps) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        const isChecked = field.value;
        return (
          <div>
            <label
              htmlFor={name}
              className="flex cursor-pointer select-none items-center"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  id={name}
                  {...props}
                  {...field}
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    isChecked && "border-primary bg-gray dark:bg-transparent"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
                  ></span>
                </div>
              </div>
              {label}
            </label>
          </div>
        );
      }}
    />
  );
}

export function StandardCheckbox({ name, label, ...props }: CheckboxProps) {
  const isChecked = props.checked;

  return (
    <div>
      <label
        htmlFor={name}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input type="checkbox" className="sr-only" id={name} {...props} />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-primary bg-gray dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
            ></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}

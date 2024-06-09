import { defaultDateTimetring } from "@/lib/DateTimeUtils";
import React from "react";
import { Controller } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  isError?: boolean;
  label?: string;
  endIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  placeholder,
  isError,
  endIcon = null,
  ...props
}: InputProps) {
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || label}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          {...props}
        />
        {endIcon !== null ? (
          <span className="absolute right-4 top-4">{endIcon}</span>
        ) : null}
      </div>
      {helperText ? <sub className="-top-1">{helperText}</sub> : null}
    </div>
  );
}

interface FInputProps extends InputProps {
  name: string;
}

export function FInput({ name, helperText, ...props }: FInputProps) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        const isDateTimeField =
          props.type === "datetime-local" && !!field.value;

        return (
          <Input
            {...props}
            {...field}
            {...(isDateTimeField
              ? {
                  value: defaultDateTimetring(field.value),
                }
              : {})}
            name={name}
            helperText={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

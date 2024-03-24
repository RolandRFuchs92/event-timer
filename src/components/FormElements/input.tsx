import React from "react";
import { Controller } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  isError?: boolean;
  label: string;
}

export function Input({
  label,
  helperText,
  placeholder,
  isError,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder || label}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        {...props}
      />
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
        return (
          <Input
            {...props}
            {...field}
            name={name}
            helperText={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

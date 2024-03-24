import { cn } from "@/lib/styles";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import z from "zod";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formMethods: ReturnType<typeof useForm<any>>;
}

export function Form({
  children,
  formMethods,
  className,
  ...props
}: FormProps) {
  return (
    <FormProvider {...formMethods}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form className={cn("p-6.5", className)} {...props}>
          <div className="mb-4.5 flex flex-col gap-6">{children}</div>
        </form>
      </div>
    </FormProvider>
  );
}

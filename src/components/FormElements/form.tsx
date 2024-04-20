import { cn } from "@/lib/styles";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import z from "zod";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formMethods: ReturnType<typeof useForm<any>>;
  formTitle: React.ReactNode;
}

export function Form({
  children,
  formMethods,
  className,
  formTitle,
  ...props
}: FormProps) {
  return (
    <FormProvider {...formMethods}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form className={cn(className)} {...props}>
          {formTitle}
          <div className="flex flex-col gap-2 p-6.5">{children}</div>
        </form>
      </div>
    </FormProvider>
  );
}

export function FormData() {
  const form = useFormContext();

  return <pre>{JSON.stringify(form.watch(), null, 2)}</pre>;
}

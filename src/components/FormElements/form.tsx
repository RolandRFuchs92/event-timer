import { cn } from "@/lib/styles";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = React.useState(false);
  const form = useFormContext();
  const debug = searchParams.get("debug");
  if (process.env.NODE_ENV !== "development" && debug !== "true") return null;

  return (
    <div>
      <button onClick={() => setIsVisible((i) => !i)} type="button">
        Show/hide
      </button>
      {isVisible === true ? (
        <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
      ) : null}
    </div>
  );
}

export function FormErrors() {
  const form = useFormContext();
  const [isVisible, setIsVisible] = React.useState(false);
  const errors = form.formState.errors;
  return (
    <div>
      <button onClick={() => setIsVisible((i) => !i)} type="button">
        Show/hide
      </button>
      {isVisible === true ? <pre>{JSON.stringify(errors, null, 2)}</pre> : null}
    </div>
  );
}

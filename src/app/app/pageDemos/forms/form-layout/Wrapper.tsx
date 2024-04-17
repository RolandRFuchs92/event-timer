"use client";

import { Form } from "@/components/FormElements/form";
import { useForm } from "react-hook-form";

export function FormForm({ children }: any) {
  const formMethods = useForm({});

  return <Form formMethods={formMethods}>{children}</Form>;
}

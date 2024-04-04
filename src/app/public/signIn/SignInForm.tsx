"use client";

import { Button } from "@/components/FormElements/button";
import { Form } from "@/components/FormElements/form";
import { FormTitle } from "@/components/FormElements/formTitle";
import { FInput } from "@/components/FormElements/input";
import { EmailIcon } from "@/components/Icons/EmailIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInSchema } from "./schema";
import { LockIcon } from "@/components/Icons/PasswordIcon";
import { signInAction } from "./action";

const appName = process.env.APP_NAME;

export function SigninForm() {
  const formMethods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = formMethods.handleSubmit(async (data) => {
    await signInAction(data);
  });

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        formMethods={formMethods}
        formTitle={<FormTitle label={`Sign into ${appName}`} />}
        className="w-80"
      >
        <FInput
          label="Email"
          type="email"
          name="username"
          placeholder="Enter your email"
          endIcon={<EmailIcon />}
        />
        <FInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          endIcon={<LockIcon />}
        />
        <Button label="Sign In" />
      </Form>
    </>
  );
}

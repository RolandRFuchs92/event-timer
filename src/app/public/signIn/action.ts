"use server";
import { action } from "@/lib/safeAction";
import { SignInSchema } from "./schema";
import { signIn } from "../../../../auth";

export const signInAction = action(SignInSchema, async (data) => {
  await signIn("credentials", data);
});

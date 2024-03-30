import { action } from "@/lib/safeAction";
import { SignInSchema } from "./schema";

export const signInAction = action(SignInSchema, async (data) => {
  console.log(data);
});

"use server";

import { signOut } from "../../../auth";

export async function logUserOut() {
  await signOut();
}

"use server";
import { decode, getToken } from "@auth/core/jwt";
import { auth } from "../../auth";
export async function getSessionUser() {
  const au = await auth();
  const data = await decode({
    secret: process.env.AUTH_SECRET!,
    salt: process.env.AUTH_SECRET!,
    token: (au as any).sessionToken,
  });

  return data;
}

"use server";

import bcrypt from "bcryptjs";
import { decode, getToken } from "@auth/core/jwt";
import { auth } from "../../auth";
import { _db } from "./db";

export async function getSessionUser() {
  const au = await auth();
  const data = await decode({
    secret: process.env.AUTH_SECRET!,
    salt: process.env.AUTH_SECRET!,
    token: (au as any).sessionToken,
  });

  return data as LoginUserModel;
}

export async function getLoginUserData(id: string) {
  const user = await _db.account.findFirst({
    where: {
      id,
    },
  });

  return user;
}

export type LoginUserModel = Awaited<ReturnType<typeof getLoginUserData>>;

type ValidateUserCredentialsProps = {
  username: string;
  password: string;
};

export async function validateUserCredentials({
  username,
  password,
}: ValidateUserCredentialsProps) {
  const user = await _db.account.findFirst({
    where: {
      email: username,
    },
  });

  if (!user) throw new Error("Cannot find user.");

  const result = await bcrypt.compare(password, user.password);
  if (!result)
    throw new Error("Username and password combination was invalid.");

  return {
    id: user.id,
    firstName: user.firstName,
    email: user.email,
    rawUser: user,
  };
}
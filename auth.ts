import { _db } from "@/lib/db";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";

export const {
  auth,
  signIn,
  handlers: { GET, POST },
  signOut,
} = NextAuth({
  ...authConfig,
});

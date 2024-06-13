import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import {
  validateUserCredentials,
} from "@/lib/authHelper";

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          type: "email",
          label: "Email",
          placeholder: "Email",
          name: "email",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "Password",
          name: "password",
        },
      },
      async authorize(credentials, request) {
        if (!credentials.username) return null;
        const user = await validateUserCredentials({
          username: credentials.username as string,
          password: credentials.password as string,
        });

        return {
          id: user!.id,
          name: user!.firstName,
          email: user!.email,
          rawUser: user,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/public/signIn",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl, ...r } }) {
      const isLoggedIn = !!auth?.user;
      const isInApp = nextUrl.pathname.startsWith("/app");

      if (isLoggedIn)
        return true;


      if (!isLoggedIn && isInApp) {
        return false;
      }

      return true;
    },

    jwt({ token, session, user, account }) {
      return {
        ...token,
        exp: 60 * 60 * 12,
      };
    },
    redirect() {
      return "/app";
    },
  },
} satisfies NextAuthConfig;

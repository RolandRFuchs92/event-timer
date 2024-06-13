import { getLoginUserData, validateUserCredentials } from "@/lib/authHelper";
import { _db } from "@/lib/db";
import NextAuth from "next-auth";
import { encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  auth,
  signIn,
  handlers: { GET, POST },
  signOut,
} = NextAuth({
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
    signIn: "/public/signin"
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      console.log("ARE YOU AUTHED?");
      const isLoggedIn = !!auth?.user;
      const isInApp = nextUrl.pathname.startsWith("/protected");

      if (isInApp) {
        if (isLoggedIn) {
          return true;
        }
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/protected", nextUrl));
      }

      return true;
    },
    jwt({ token, session, user, account }) {
      return token;
    },
    async session({ session, token }) {
      const user = await getLoginUserData(token.sub!);

      const encryptedUserData = await encode({
        token: user,
        salt: process.env.AUTH_SECRET!,
        secret: process.env.AUTH_SECRET!,
      });
      session.sessionToken = encryptedUserData;
      return session;
    },
    redirect() {
      return "/app";
    },
  },
});

import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Passcode", type: "password" },
      },
      async authorize(credentials) {
        if (!process.env.APP_PASSWORD) {
          throw new Error("APP_PASSWORD is not set");
        }
        if (credentials?.password === process.env.APP_PASSWORD) {
          return { id: "team", name: "RL Spencer Team" };
        }
        return null;
      },
    }),
  ],
};

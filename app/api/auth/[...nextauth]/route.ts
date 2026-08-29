import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
  session: {
    strategy: "jwt" as "jwt",
    maxAge: 24 * 60 * 60 // 24 hours

  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
          console.log("credentials", credentials);
          if (credentials.password === "z2501")
             return {
                id: "doug",
                email: "user.email",
                name: "Doug"};
     
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
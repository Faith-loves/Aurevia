import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/server/users";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env["AUTH_SECRET"] ?? process.env["NEXTAUTH_SECRET"],
  pages: { signIn: "/sign-in" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
      }
      return session;
    },
  },
};

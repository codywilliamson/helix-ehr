/**
 * NextAuth.js configuration for helix-ehr.
 *
 * Currently uses the Credentials provider for development simplicity.
 * This allows username/password auth against our PostgreSQL users table.
 *
 * For production, swap CredentialsProvider for an OAuth provider:
 * - Replace `CredentialsProvider` with e.g. `GoogleProvider`, `AzureADProvider`
 * - Remove the `authorize` callback
 * - Update the `session` and `jwt` callbacks to map provider profile fields
 *
 * The Credentials provider is used here because:
 * 1. It mirrors real EHR auth flows (username + password)
 * 2. It avoids requiring third-party OAuth setup for local development
 * 3. It keeps the auth boundary simple while the app is scaffolded
 */

import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // DEV-ONLY: Hardcoded demo users for local development.
        // Replace with a real database lookup before any deployment.
        const devUsers: (SessionUser & { password: string })[] = [
          {
            id: "1",
            email: "admin@helix.dev",
            name: "Dr. Admin",
            role: "admin",
            password: "password",
          },
          {
            id: "2",
            email: "provider@helix.dev",
            name: "Dr. Smith",
            role: "provider",
            password: "password",
          },
        ];

        const user = devUsers.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password,
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — reasonable for a clinical session
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as SessionUser).role;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as SessionUser).id = token.id as string;
        (session.user as SessionUser).role = token.role as string;
      }
      return session;
    },
  },
};

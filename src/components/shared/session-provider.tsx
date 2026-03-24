/**
 * Client Component — NextAuth Session Provider wrapper.
 *
 * This is a Client Component because SessionProvider uses React Context
 * to distribute session state to descendant components. It enables
 * `useSession()` in any Client Component within the tree.
 *
 * Data: Receives children from the root layout. Provides NextAuth
 * session state via React Context.
 */
"use client";

import { SessionProvider } from "next-auth/react";

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

/**
 * NextAuth.js API route handler.
 *
 * This is a server-side catch-all route that handles all NextAuth.js
 * authentication endpoints (sign-in, sign-out, session, CSRF, etc.).
 * Configuration is centralized in `src/lib/auth.ts`.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

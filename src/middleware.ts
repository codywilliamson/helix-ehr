/**
 * Next.js Middleware — runs at the edge before every matched request.
 *
 * This middleware protects all /dashboard routes by checking for a valid
 * NextAuth session token. Unauthenticated users are redirected to /login.
 *
 * Key concepts:
 * - Middleware runs BEFORE any page renders (Server or Client Component)
 * - It runs on the Edge Runtime, not Node.js — limited API surface
 * - It cannot read/write to a database directly
 * - It CAN read cookies, headers, and redirect/rewrite requests
 * - The `matcher` config controls which routes trigger this middleware
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname === "/login";
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect authenticated users away from login page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

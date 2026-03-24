/**
 * Client Component — Sign-in button for the landing page.
 *
 * This is a Client Component because the Button primitive from shadcn/ui
 * requires client-side rendering (it uses base-ui under the hood).
 *
 * Data: None. Renders a styled link to the login page.
 */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeSignInButton() {
  return (
    <Button className="w-full" render={<Link href="/login" />}>
      Sign In
    </Button>
  );
}

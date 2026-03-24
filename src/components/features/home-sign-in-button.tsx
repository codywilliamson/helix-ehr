/**
 * Client Component — Sign-in button for the landing page.
 *
 * This is a Client Component because it uses the `useRouter` hook
 * for client-side navigation on click.
 *
 * Data: None. Navigates to the login page on click.
 */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function HomeSignInButton() {
  const router = useRouter();

  return (
    <Button className="w-full" onClick={() => router.push("/login")}>
      Sign In
    </Button>
  );
}

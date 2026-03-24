/**
 * Server Component — Landing page.
 *
 * This is a Server Component because it renders static content with no
 * interactivity. It serves as a simple redirect target before auth is
 * wired up, showing a brief overview of the application.
 *
 * Data: None. Static content only.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HomeSignInButton } from "@/components/features/home-sign-in-button";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Helix EHR</CardTitle>
          <CardDescription>
            A minimal electronic health record system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <HomeSignInButton />
        </CardContent>
      </Card>
    </main>
  );
}

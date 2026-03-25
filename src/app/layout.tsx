/**
 * Server Component — Root layout.
 *
 * This is a Server Component because it only defines static HTML structure,
 * metadata, and font loading. No interactivity or browser APIs are needed.
 *
 * Data: None. Wraps the entire application with global providers
 * (Apollo, NextAuth session) and applies fonts + global styles.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ApolloProviderWrapper } from "@/components/shared/apollo-provider";
import { AuthSessionProvider } from "@/components/shared/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helix EHR",
  description:
    "A minimal electronic health record system built with Next.js, Hasura, GraphQL, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="bg-background text-foreground flex min-h-full flex-col"
        suppressHydrationWarning
      >
        <AuthSessionProvider>
          <ApolloProviderWrapper>
            {children}
            <Toaster />
          </ApolloProviderWrapper>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

/**
 * Server Component — Dashboard layout.
 *
 * This is a Server Component because it defines the structural shell
 * for all dashboard routes (sidebar, header, etc.) without interactivity.
 *
 * Data: None. Provides layout structure for nested dashboard pages.
 */

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/patients", label: "Patients" },
] as const;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-card hidden w-64 flex-col border-r p-6 md:flex">
        <Link href="/dashboard" className="mb-6">
          <h2 className="text-lg font-bold tracking-tight">Helix EHR</h2>
        </Link>

        <Separator className="mb-4" />

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

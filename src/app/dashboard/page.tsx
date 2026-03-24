/**
 * Server Component — Dashboard page.
 *
 * This is a Server Component because it fetches summary statistics
 * server-side via Apollo and renders static cards. No client interactivity
 * is needed for the initial view.
 *
 * Data: Fetches patient count, visit count, and recent visits from Hasura
 * via the GET_DASHBOARD_STATS query using the server-side Apollo client.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * Placeholder dashboard that renders static skeleton cards.
 *
 * Once Hasura is running and seeded, this page will fetch real data
 * using `getServerClient()` and the `GET_DASHBOARD_STATS` query.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of patients and recent activity
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Patients</CardDescription>
            <CardTitle className="text-4xl">
              <Skeleton className="h-10 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              All registered patients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Visits</CardDescription>
            <CardTitle className="text-4xl">
              <Skeleton className="h-10 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Across all patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Recent Visits</CardDescription>
            <CardTitle className="text-4xl">
              <Skeleton className="h-10 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">In the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest visit notes across all patients
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

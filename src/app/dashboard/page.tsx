/**
 * Server Component — Dashboard page.
 *
 * This is a Server Component because it renders summary data with no
 * client interactivity. Currently uses mock data; will switch to
 * Hasura queries via `getServerClient()` once the backend is live.
 *
 * Data: Mock patient/visit counts and recent visit list from `src/lib/mock-data.ts`.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockPatients, mockVisits, recentVisits } from "@/lib/mock-data";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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
            <CardTitle className="text-4xl">{mockPatients.length}</CardTitle>
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
            <CardTitle className="text-4xl">{mockVisits.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Across all patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Recent Visits</CardDescription>
            <CardTitle className="text-4xl">{recentVisits.length}</CardTitle>
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
        <CardContent className="flex flex-col gap-4">
          {recentVisits.map((visit) => (
            <div
              key={visit.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <Avatar className="mt-0.5">
                <AvatarFallback>
                  {getInitials(visit.patient_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{visit.patient_name}</span>
                  <Badge variant="outline">{visit.chief_complaint}</Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {visit.notes}
                </p>
                <p className="text-muted-foreground text-xs">
                  {visit.provider} &middot; {formatDate(visit.date)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Server Component — Patient detail page.
 *
 * This is a Server Component because it renders patient profile data and
 * visit history without client interactivity. The dynamic `[id]` segment
 * is read from params to look up the patient.
 *
 * Data: Mock patient and visit data from `src/lib/mock-data.ts`.
 * Will switch to a Hasura query by patient ID once the backend is live.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
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
import { mockPatients, mockVisits } from "@/lib/mock-data";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getInitials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    notFound();
  }

  const visits = mockVisits
    .filter((v) => v.patient_id === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/patients"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
        >
          &larr; Back to patients
        </Link>
      </div>

      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg">
            {getInitials(patient.first_name, patient.last_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {patient.first_name} {patient.last_name}
          </h1>
          <p className="text-muted-foreground">
            {calculateAge(patient.dob)} years old &middot;{" "}
            <span className="capitalize">{patient.gender}</span>
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{patient.email ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{patient.phone ?? "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(patient.dob)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground">Registered</p>
              <p className="font-medium">{formatDate(patient.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(patient.updated_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visit History</CardTitle>
            <CardDescription>
              {visits.length} visit{visits.length !== 1 ? "s" : ""} on record
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visits.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No visits recorded for this patient.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex flex-col gap-2 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{visit.chief_complaint}</Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(visit.date)}
                      </span>
                    </div>
                    {visit.notes && (
                      <p className="text-sm leading-relaxed">{visit.notes}</p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      {visit.provider}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

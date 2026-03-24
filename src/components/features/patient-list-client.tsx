/**
 * Client Component — Patient list with search, gender filter, and pagination.
 *
 * This is a Client Component because it manages local UI state for search
 * input, filter selection, and current page. The parent Server Component
 * passes in the full patient array.
 *
 * Data: Receives `Patient[]` from the parent page component.
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Patient, Gender } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 5;

function getInitials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

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

interface PatientListClientProps {
  patients: Patient[];
}

export function PatientListClient({ patients }: PatientListClientProps) {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<Gender | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return patients.filter((p) => {
      const matchesSearch =
        !query ||
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(query) ||
        (p.email?.toLowerCase().includes(query) ?? false) ||
        (p.phone?.includes(query) ?? false);

      const matchesGender =
        genderFilter === "all" || p.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [patients, search, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleGenderChange(value: string | null) {
    if (!value) return;
    setGenderFilter(value as Gender | "all");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={genderFilter} onValueChange={handleGenderChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground ml-auto text-sm">
          {filtered.length} patient{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">
                Registered
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground h-24 text-center"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/patients/${patient.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(patient.first_name, patient.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {patient.first_name} {patient.last_name}
                        </p>
                        {patient.email && (
                          <p className="text-muted-foreground text-xs">
                            {patient.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{calculateAge(patient.dob)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {patient.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.phone ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(patient.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

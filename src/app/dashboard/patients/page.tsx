/**
 * Server Component — Patient list page.
 *
 * This is a Server Component because the initial patient data render
 * requires no client interactivity. Search/filter/pagination are handled
 * by the PatientListClient component which receives the full dataset
 * and filters client-side. Once Hasura is live, filtering will move
 * server-side via query params.
 *
 * Data: Mock patient list from `src/lib/mock-data.ts`.
 */

import { Separator } from "@/components/ui/separator";
import { mockPatients } from "@/lib/mock-data";
import { PatientListClient } from "@/components/features/patient-list-client";
import { AddPatientDialog } from "@/components/features/add-patient-dialog";

export default function PatientsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view all registered patients
          </p>
        </div>
        <AddPatientDialog />
      </div>

      <Separator />

      <PatientListClient patients={mockPatients} />
    </div>
  );
}

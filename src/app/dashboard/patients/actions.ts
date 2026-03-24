/**
 * Server Action — creates a new patient record.
 *
 * "use server" means this function ONLY executes on the server, even though
 * it's called from a Client Component's form submission. Next.js automatically
 * serializes the FormData, sends it as a POST request, and deserializes the
 * response — no manual API route needed.
 *
 * Data flow:
 *   Client form → FormData → this function (server) → mock database → revalidate
 *
 * In production, the mockPatients.push() would be replaced with a Hasura
 * GraphQL mutation (INSERT INTO patients).
 */
"use server";

import { patientFormSchema } from "@/lib/schemas/patient";
import { mockPatients } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

/** Field-level error map returned to the client on validation failure. */
export type FieldErrors = Partial<
  Record<keyof typeof patientFormSchema.shape, string[]>
>;

export type CreatePatientResult =
  | { ok: true; patientId: string }
  | { ok: false; errors: FieldErrors };

export async function createPatient(
  formData: FormData,
): Promise<CreatePatientResult> {
  // Server-side validation — never trust client input
  const raw = Object.fromEntries(formData.entries());
  const result = patientFormSchema.safeParse(raw);

  if (!result.success) {
    // Zod 4: .format() returns { fieldName: { _errors: string[] } }
    const formatted = result.error.format();
    const errors: FieldErrors = {};

    for (const key of Object.keys(patientFormSchema.shape)) {
      const field = formatted[key as keyof typeof formatted];
      if (field && typeof field === "object" && "_errors" in field) {
        const fieldErrors = (field as { _errors: string[] })._errors;
        if (fieldErrors.length > 0) {
          errors[key as keyof FieldErrors] = fieldErrors;
        }
      }
    }

    return { ok: false, errors };
  }

  const newPatient = {
    id: `p-${String(mockPatients.length + 1).padStart(3, "0")}`,
    ...result.data,
    email: result.data.email ?? null,
    phone: result.data.phone ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockPatients.push(newPatient);

  // Tell Next.js the /dashboard/patients page data is stale.
  // On the next request, it will re-render with the new patient included.
  revalidatePath("/dashboard/patients");

  return { ok: true, patientId: newPatient.id };
}
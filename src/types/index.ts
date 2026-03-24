/**
 * Shared TypeScript types for helix-ehr.
 *
 * All domain types live here. GraphQL-specific response wrappers
 * are co-located with their queries in `src/graphql/`.
 */

/** Gender options stored in the patients table. */
export type Gender = "male" | "female" | "other" | "unknown";

/** A patient record as stored in PostgreSQL / returned by Hasura. */
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: Gender;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

/** A clinical visit note linked to a patient. */
export interface Visit {
  id: string;
  patient_id: string;
  date: string;
  provider: string;
  chief_complaint: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** An application user (clinician / admin). */
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "provider" | "staff";
  created_at: string;
}

/**
 * A discriminated union for async operation results.
 *
 * Prefer this over try/catch for operations where the caller
 * needs to distinguish success from failure in a type-safe way.
 */
export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

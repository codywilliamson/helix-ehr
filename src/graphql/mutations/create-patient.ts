/**
 * Creates a new patient record.
 *
 * This is a MUTATION because it inserts a new row into the `patients` table.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have INSERT access on the `patients` table.
 * - All columns except `id`, `created_at`, and `updated_at` must be writable.
 */

import { gql } from "@apollo/client";
import { PATIENT_CORE_FIELDS } from "@/graphql/fragments/patient-fields";

export const CREATE_PATIENT = gql`
  ${PATIENT_CORE_FIELDS}

  mutation CreatePatient($input: patients_insert_input!) {
    insert_patients_one(object: $input) {
      ...PatientCoreFields
    }
  }
`;

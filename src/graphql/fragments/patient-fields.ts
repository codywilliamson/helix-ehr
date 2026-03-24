/**
 * Shared fragment for patient fields.
 *
 * Used by both the patient list query (abbreviated) and the patient
 * detail query (full). Centralizing field selection here ensures
 * consistency when the schema evolves.
 */

import { gql } from "@apollo/client";

export const PATIENT_CORE_FIELDS = gql`
  fragment PatientCoreFields on patients {
    id
    first_name
    last_name
    dob
    gender
    email
    phone
    created_at
    updated_at
  }
`;

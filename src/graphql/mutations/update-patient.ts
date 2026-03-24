/**
 * Updates an existing patient record by ID.
 *
 * This is a MUTATION because it modifies an existing row in the `patients` table.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have UPDATE access on the `patients` table.
 * - The `id` column must be usable as a filter condition.
 */

import { gql } from "@apollo/client";
import { PATIENT_CORE_FIELDS } from "@/graphql/fragments/patient-fields";

export const UPDATE_PATIENT = gql`
  ${PATIENT_CORE_FIELDS}

  mutation UpdatePatient($id: uuid!, $input: patients_set_input!) {
    update_patients_by_pk(pk_columns: { id: $id }, _set: $input) {
      ...PatientCoreFields
    }
  }
`;

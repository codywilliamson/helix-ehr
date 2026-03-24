/**
 * Fetches a single patient by ID, including their visit history.
 *
 * This is a QUERY because it reads patient and visit data without side effects.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have SELECT access on `patients` and `visits`.
 * - The `visits` relationship must be tracked in Hasura metadata.
 */

import { gql } from "@apollo/client";
import { PATIENT_CORE_FIELDS } from "@/graphql/fragments/patient-fields";
import { VISIT_CORE_FIELDS } from "@/graphql/fragments/visit-fields";

export const GET_PATIENT_BY_ID = gql`
  ${PATIENT_CORE_FIELDS}
  ${VISIT_CORE_FIELDS}

  query GetPatientById($id: uuid!) {
    patients_by_pk(id: $id) {
      ...PatientCoreFields
      visits(order_by: { date: desc }) {
        ...VisitCoreFields
      }
    }
  }
`;

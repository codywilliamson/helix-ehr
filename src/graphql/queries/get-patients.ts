/**
 * Fetches a paginated, searchable list of patients.
 *
 * This is a QUERY because it reads patient data without side effects.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have SELECT access on the `patients` table.
 * - All columns in PatientCoreFields must be permitted.
 *
 * Variables:
 * - limit: page size
 * - offset: pagination offset
 * - search: optional partial match on first_name or last_name (case-insensitive)
 */

import { gql } from "@apollo/client";
import { PATIENT_CORE_FIELDS } from "@/graphql/fragments/patient-fields";

export const GET_PATIENTS = gql`
  ${PATIENT_CORE_FIELDS}

  query GetPatients($limit: Int!, $offset: Int!, $search: String) {
    patients(
      limit: $limit
      offset: $offset
      order_by: { last_name: asc }
      where: {
        _or: [
          { first_name: { _ilike: $search } }
          { last_name: { _ilike: $search } }
        ]
      }
    ) {
      ...PatientCoreFields
    }

    patients_aggregate(
      where: {
        _or: [
          { first_name: { _ilike: $search } }
          { last_name: { _ilike: $search } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

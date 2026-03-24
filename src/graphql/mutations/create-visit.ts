/**
 * Creates a new visit note for a patient.
 *
 * This is a MUTATION because it inserts a new row into the `visits` table.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have INSERT access on the `visits` table.
 * - The `patient_id` foreign key must reference a valid patient.
 */

import { gql } from "@apollo/client";
import { VISIT_CORE_FIELDS } from "@/graphql/fragments/visit-fields";

export const CREATE_VISIT = gql`
  ${VISIT_CORE_FIELDS}

  mutation CreateVisit($input: visits_insert_input!) {
    insert_visits_one(object: $input) {
      ...VisitCoreFields
    }
  }
`;

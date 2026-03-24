/**
 * Shared fragment for visit fields.
 *
 * Used by the visit list within a patient detail view and the
 * dashboard recent-visits query. Keeps field selection DRY.
 */

import { gql } from "@apollo/client";

export const VISIT_CORE_FIELDS = gql`
  fragment VisitCoreFields on visits {
    id
    patient_id
    date
    provider
    chief_complaint
    notes
    created_at
    updated_at
  }
`;

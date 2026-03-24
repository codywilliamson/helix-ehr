/**
 * Fetches aggregate statistics for the dashboard view.
 *
 * This is a QUERY because it reads aggregate counts without side effects.
 *
 * Hasura permissions required:
 * - Role `provider` or `admin` must have SELECT access on `patients` and `visits`.
 * - Aggregate queries must be enabled for both tables in Hasura permissions.
 */

import { gql } from "@apollo/client";
import { VISIT_CORE_FIELDS } from "@/graphql/fragments/visit-fields";

export const GET_DASHBOARD_STATS = gql`
  ${VISIT_CORE_FIELDS}

  query GetDashboardStats($recentVisitsLimit: Int!) {
    patients_aggregate {
      aggregate {
        count
      }
    }

    visits_aggregate {
      aggregate {
        count
      }
    }

    recent_visits: visits(limit: $recentVisitsLimit, order_by: { date: desc }) {
      ...VisitCoreFields
      patient {
        id
        first_name
        last_name
      }
    }
  }
`;

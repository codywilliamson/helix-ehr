/**
 * Apollo Client configuration for helix-ehr.
 *
 * This module provides two Apollo Client instances:
 *
 * 1. `getServerClient()` — For use in React Server Components and server-side
 *    data fetching. Creates a new client per request to avoid sharing state
 *    across users. Does not use a persistent cache.
 *
 * 2. `browserClient` — A singleton for use in Client Components. Uses an
 *    in-memory cache that persists across navigations for a smooth UX.
 *
 * Usage:
 * - Server Component: `const client = getServerClient();`
 * - Client Component: wrap your tree with `<ApolloProviderWrapper>` and use
 *   hooks like `useQuery` / `useMutation` as normal.
 */

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ??
  "http://localhost:8080/v1/graphql";

function createHttpLink(): HttpLink {
  return new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      "content-type": "application/json",
    },
  });
}

/**
 * Returns a fresh Apollo Client for server-side usage.
 *
 * A new client is created on every call so that request-scoped data
 * is never leaked between users or requests.
 */
export function getServerClient(): ApolloClient {
  return new ApolloClient({
    link: createHttpLink(),
    cache: new InMemoryCache(),
    ssrMode: true,
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}

/**
 * Singleton Apollo Client for browser-side usage.
 *
 * The in-memory cache persists across client-side navigations, which avoids
 * redundant network requests and provides instant back-navigation.
 */
let _browserClient: ApolloClient | null = null;

export function getBrowserClient(): ApolloClient {
  if (typeof window === "undefined") {
    throw new Error(
      "getBrowserClient() must only be called in Client Components. " +
        "Use getServerClient() for server-side data fetching.",
    );
  }

  if (!_browserClient) {
    _browserClient = new ApolloClient({
      link: createHttpLink(),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: "cache-first" as const,
          errorPolicy: "all" as const,
        },
        watchQuery: {
          fetchPolicy: "cache-and-network" as const,
          errorPolicy: "all" as const,
        },
      },
    });
  }

  return _browserClient;
}

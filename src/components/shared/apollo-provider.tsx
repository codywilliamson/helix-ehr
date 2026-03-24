/**
 * Client Component — Apollo Provider wrapper.
 *
 * This is a Client Component because ApolloProvider uses React Context,
 * which requires client-side rendering. It wraps the application tree
 * so that all descendant Client Components can use Apollo hooks
 * (useQuery, useMutation, etc.).
 *
 * Data: Receives children from the root layout. Provides the browser-side
 * Apollo Client instance via React Context.
 */
"use client";

import { useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  const client = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({
        uri:
          process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ??
          "http://localhost:8080/v1/graphql",
        headers: { "content-type": "application/json" },
      }),
      cache: new InMemoryCache(),
      ssrMode: typeof window === "undefined",
      defaultOptions: {
        query: { errorPolicy: "all" as const },
        watchQuery: { errorPolicy: "all" as const },
      },
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

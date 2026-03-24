# Architecture

## Overview

Helix EHR is a full-stack application with a clear separation between the frontend (Next.js), the API layer (Hasura GraphQL Engine), and the database (PostgreSQL).

```
┌───────────────────────────────────────────────┐
│                   Browser                     │
│         Next.js (Server + Client)             │
│     ┌──────────┐  ┌──────────┐  ┌────────┐   │
│     │ shadcn/  │  │  Apollo  │  │  Next  │   │
│     │ Tailwind │  │  Client  │  │  Auth  │   │
│     └────┬─────┘  └────┬─────┘  └───┬────┘   │
└──────────┼──────────────┼────────────┼────────┘
           │         GraphQL           │
┌──────────┼──────────────┼────────────┼────────┐
│          │    Hasura GraphQL Engine   │        │
│          │              │            │        │
│          │         PostgreSQL        │        │
│          │    ┌─────────┴────────┐   │        │
│          │    │ patients, visits │   │        │
│          │    │ users            │   │        │
│          │    └──────────────────┘   │        │
│          └── Docker Compose ─────────┘        │
└───────────────────────────────────────────────┘
```

## Data Flow

1. **Server Components** fetch data directly via Apollo's server client — no client-side JS needed.
2. **Client Components** use Apollo hooks (`useQuery`, `useMutation`) through a shared browser client with normalized caching.
3. **Hasura** auto-generates the GraphQL API from the PostgreSQL schema. Permissions, relationships, and aggregations are configured via Hasura metadata.
4. **Authentication** is handled by NextAuth with JWT sessions. The JWT is used to set Hasura role headers for permission enforcement.

## Database Schema

Three core tables:

- **users** — Application users (admins, providers, staff) with email/password auth.
- **patients** — Patient demographics and contact info.
- **visits** — Clinical encounter notes, each linked to a patient via foreign key.

All tables use UUID primary keys and `created_at`/`updated_at` timestamps. The `patients` and `visits` tables have auto-updating triggers on `updated_at`.

Migrations live in `hasura/migrations/` and are applied automatically by Docker on first boot.

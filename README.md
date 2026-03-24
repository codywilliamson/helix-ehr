# Helix EHR

A minimal, production-grade electronic health record (EHR) system built to demonstrate senior full-stack engineering craft. Every architectural decision, commit, and component reflects professional standards.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  Next.js App (React Server + Client Components)     │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  shadcn/ui  │  │  Apollo  │  │  NextAuth.js  │  │
│  │  Tailwind   │  │  Client  │  │  (JWT)        │  │
│  └──────┬──────┘  └────┬─────┘  └───────┬───────┘  │
└─────────┼──────────────┼────────────────┼───────────┘
          │              │                │
          │         GraphQL (HTTP)        │
          │              │                │
┌─────────┼──────────────┼────────────────┼───────────┐
│         │    Hasura GraphQL Engine      │           │
│         │    ┌─────────┴─────────┐      │           │
│         │    │  Auto-generated   │      │           │
│         │    │  CRUD + Realtime  │      │           │
│         │    │  + Permissions    │      │           │
│         │    └─────────┬─────────┘      │           │
│         │              │                │           │
│         │         PostgreSQL 15         │           │
│         │    ┌─────────┴─────────┐      │           │
│         │    │  patients         │      │           │
│         │    │  visits           │      │           │
│         │    │  users            │      │           │
│         │    └───────────────────┘      │           │
│         │                               │           │
│         └── Docker Compose ─────────────┘           │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Technology                                                 | Purpose                    | Why                                                 |
| ---------------------------------------------------------- | -------------------------- | --------------------------------------------------- |
| [Next.js 16](https://nextjs.org/)                          | Full-stack React framework | App Router, RSC, API routes, edge-ready             |
| [TypeScript](https://www.typescriptlang.org/)              | Type safety                | Strict mode, no `any`, catches bugs at compile time |
| [Tailwind CSS 4](https://tailwindcss.com/)                 | Styling                    | Utility-first, design-system-friendly, zero runtime |
| [shadcn/ui](https://ui.shadcn.com/)                        | Component library          | Accessible, composable, owns the code               |
| [Hasura](https://hasura.io/)                               | GraphQL engine             | Instant CRUD API, real-time subscriptions, RBAC     |
| [PostgreSQL 15](https://www.postgresql.org/)               | Database                   | Battle-tested relational DB, UUID support, triggers |
| [Apollo Client](https://www.apollographql.com/docs/react/) | GraphQL client             | Normalized cache, SSR support, hooks API            |
| [NextAuth.js](https://next-auth.js.org/)                   | Authentication             | JWT sessions, provider-agnostic, Next.js native     |
| [Zod](https://zod.dev/)                                    | Schema validation          | Runtime + compile-time validation, form integration |
| [react-hook-form](https://react-hook-form.com/)            | Form management            | Performant, minimal re-renders, Zod integration     |

## Prerequisites

- **Node.js** >= 18.17
- **pnpm** >= 9 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker** and **Docker Compose** (for Hasura + PostgreSQL)
- **Git** >= 2.30

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/codywilliamson/helix-ehr.git
cd helix-ehr
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the required values (see [Environment Variables](#environment-variables)).

### 4. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL and Hasura. Hasura console is available at [http://localhost:8080](http://localhost:8080).

### 5. Run database migrations

Apply the SQL migrations in `hasura/migrations/` through the Hasura console or CLI:

```bash
# Using Hasura CLI (if installed)
cd hasura
hasura migrate apply --database-name default
```

Or paste each migration file into the Hasura console SQL tab manually.

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Compose

| Service    | Port | Description                     |
| ---------- | ---- | ------------------------------- |
| `postgres` | 5432 | PostgreSQL 15 database          |
| `hasura`   | 8080 | Hasura GraphQL Engine + Console |

```bash
docker compose up -d     # Start services
docker compose down      # Stop services
docker compose logs -f   # Follow logs
```

Data persists in a named Docker volume (`helix-ehr-pgdata`).

## Environment Variables

| Variable                         | Required | Default                                                 | Description                                               |
| -------------------------------- | -------- | ------------------------------------------------------- | --------------------------------------------------------- |
| `NEXTAUTH_URL`                   | Yes      | `http://localhost:3000`                                 | Base URL for NextAuth callbacks                           |
| `NEXTAUTH_SECRET`                | Yes      | —                                                       | Random secret for JWT signing (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_HASURA_GRAPHQL_URL` | Yes      | `http://localhost:8080/v1/graphql`                      | Hasura GraphQL endpoint                                   |
| `HASURA_GRAPHQL_ADMIN_SECRET`    | Yes      | `your-hasura-admin-secret`                              | Admin secret for Hasura                                   |
| `DATABASE_URL`                   | Yes      | `postgres://postgres:postgres@localhost:5432/helix_ehr` | PostgreSQL connection string                              |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
  components/
    ui/                   # shadcn primitives (auto-generated)
    shared/               # Reusable app components (providers, etc.)
    features/             # Feature-specific components
  lib/
    apollo-client.ts      # GraphQL client setup (server + browser)
    auth.ts               # NextAuth configuration
    utils.ts              # cn() utility and shared helpers
  graphql/
    queries/              # GraphQL query definitions
    mutations/            # GraphQL mutation definitions
    fragments/            # Shared GraphQL fragments
  types/                  # Shared TypeScript types
  hooks/                  # Custom React hooks
hasura/
  metadata/               # Hasura metadata exports
  migrations/             # SQL migration files
  seeds/                  # Seed data
```

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint + husky.

| Prefix      | Use When                                |
| ----------- | --------------------------------------- |
| `feat:`     | Adding a new feature                    |
| `fix:`      | Fixing a bug                            |
| `chore:`    | Tooling, config, dependencies           |
| `docs:`     | Documentation changes                   |
| `refactor:` | Code restructuring (no behavior change) |
| `style:`    | Formatting only                         |
| `test:`     | Adding or updating tests                |

Releases are managed with [standard-version](https://github.com/conventional-changelog/standard-version):

```bash
pnpm run release        # Bump version based on commits
pnpm run release:minor  # Force minor version bump
pnpm run release:major  # Force major version bump
```

## Roadmap

- [x] Project scaffold (Next.js, TypeScript, Tailwind, shadcn)
- [x] Conventional commits + semantic versioning
- [x] Docker Compose (Hasura + PostgreSQL)
- [x] Database schema (patients, visits, users)
- [x] Apollo Client (server + browser)
- [x] NextAuth credentials provider
- [x] Login page with form validation
- [x] Dashboard layout with skeleton cards
- [ ] Live dashboard with real Hasura data
- [ ] Patient list with search, filter, pagination
- [ ] Patient detail with visit history
- [ ] Add/edit patient form
- [ ] Add visit note modal
- [ ] Role-based access control via Hasura permissions
- [ ] Dark mode toggle
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline (GitHub Actions)

## License

MIT

# Tech Stack

## Frontend

- **Next.js** — Full-stack React framework. App Router with React Server Components for server-rendered pages and API routes.
- **TypeScript** — Strict mode enabled. No `any` types.
- **Tailwind CSS** — Utility-first styling. No CSS modules or inline styles.
- **shadcn/ui** — Accessible component primitives. We own the source — components live in `src/components/ui/`.

## API Layer

- **Hasura** — Instant GraphQL API over PostgreSQL. Handles CRUD, real-time subscriptions, and role-based permissions without writing resolvers.
- **Apollo Client** — GraphQL client with separate server and browser instances. Normalized caching on the client side.

## Backend

- **PostgreSQL** — Primary data store. UUID keys, check constraints, triggers for `updated_at`.
- **Docker Compose** — Local dev orchestration for Postgres and Hasura.

## Auth

- **NextAuth.js** — JWT-based sessions via the Credentials provider. Swap to OAuth for production.

## Forms & Validation

- **Zod** — Schema validation at runtime and compile time.
- **react-hook-form** — Performant form state management with Zod resolver integration.

## Tooling

- **pnpm** — Package manager.
- **ESLint** — Linting.
- **Prettier** — Code formatting with Tailwind class sorting.
- **Husky + lint-staged** — Pre-commit formatting and linting.
- **commitlint** — Enforces conventional commit messages.
- **standard-version** — Semantic versioning and changelog generation.

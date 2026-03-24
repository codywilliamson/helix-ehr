# Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` | Base URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Yes | — | Random secret for JWT signing. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_HASURA_GRAPHQL_URL` | Yes | `http://localhost:8080/v1/graphql` | Hasura GraphQL endpoint |
| `HASURA_GRAPHQL_ADMIN_SECRET` | Yes | `your-hasura-admin-secret` | Admin secret for Hasura console and metadata API |
| `DATABASE_URL` | Yes | `postgres://postgres:postgres@localhost:5432/helix_ehr` | PostgreSQL connection string |

## Docker Services

| Service | Port | Description |
|---|---|---|
| `postgres` | 5432 | PostgreSQL database |
| `hasura` | 8080 | Hasura GraphQL Engine + Console |

Data persists in a named Docker volume (`helix-ehr-pgdata`). To reset everything: `docker compose down -v`.

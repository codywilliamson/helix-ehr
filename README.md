# Helix EHR

A minimal electronic health record system. Built with Next.js, Hasura, GraphQL, and TypeScript.

**[Live Demo](https://helix-ehr.vercel.app/dashboard)**

## Quick Start

Requires Node.js, pnpm, and Docker.

```bash
git clone https://github.com/codywilliamson/helix-ehr.git
cd helix-ehr
pnpm install
cp .env.example .env.local
./scripts/start-dev.ps1
```

The start script handles Docker, database setup, and launches the dev server.

- **App:** http://localhost:3000
- **Hasura Console:** http://localhost:8080
- **Login:** `admin@helix.dev` / `password`

## Documentation

See [`docs/systems/`](docs/systems/) for architecture, tech stack decisions, environment variables, and contributing guidelines.

## License

[MIT](LICENSE)

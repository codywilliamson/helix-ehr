# Helix EHR

A demo EHR project for learning Next.js App Router, Server Components, Server Actions, and modern React patterns. Built with Next.js, Hasura, GraphQL, and TypeScript.

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

## Local Development

For the existing local flow, nothing about Vercel deployment changes. You can still run the app locally with Docker-backed Postgres and Hasura:

```bash
pnpm install
cp .env.example .env.local
pnpm dev:stack
```

If Hasura is already running somewhere else, you can re-apply the tracked tables and relationships with:

```bash
pnpm hasura:configure
```

## Documentation

See [`docs/systems/`](docs/systems/) for architecture, tech stack decisions, environment variables, and contributing guidelines.

## GKE Starter Deployment

This repo now includes a simple Kubernetes starter under [`k8s/`](k8s/) for running both the Next.js app and a self-hosted Hasura instance on Google Kubernetes Engine.

### What was added

- `Dockerfile`: multi-stage production image for `Next.js` standalone output
- `k8s/deployment.yaml`: web deployment with probes and resource requests
- `k8s/service.yaml`: cluster service for the web app
- `k8s/hasura-deployment.yaml`: self-hosted Hasura deployment
- `k8s/hasura-service.yaml`: cluster service for Hasura
- `k8s/ingress.yaml`: starter GKE ingress
- `k8s/configmap.yaml`, `k8s/hasura-configmap.yaml`, and `k8s/secret.example.yaml`: environment variable templates

### Suggested GCP learning path

If you want something close to a real team setup without going all the way into platform engineering, this is a good progression:

1. Build and run the app container locally.
2. Push the image to Artifact Registry.
3. Deploy the web app to a small GKE Autopilot cluster.
4. Use Cloud SQL for PostgreSQL.
5. Run Hasura in GKE and connect it to Cloud SQL.
6. Re-apply Hasura metadata with `pnpm hasura:configure` against the exposed Hasura endpoint.

### Build the production image

```bash
docker build -t helix-ehr:local .
docker run --rm -p 3000:3000 --env-file .env.local helix-ehr:local
```

### Example GKE flow

Update the placeholders in `k8s/` first, especially:

- image path in `k8s/deployment.yaml`
- host name in `k8s/ingress.yaml`
- secrets in `k8s/secret.example.yaml`
- public app and Hasura URLs in `k8s/configmap.yaml`

Then apply:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/hasura-configmap.yaml
kubectl apply -f k8s/secret.example.yaml
kubectl apply -f k8s/hasura-deployment.yaml
kubectl apply -f k8s/hasura-service.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

After Hasura is reachable, point the metadata script at it and apply the tracked tables and relationships:

```bash
HASURA_URL=https://graphql.example.com \
HASURA_GRAPHQL_ADMIN_SECRET=replace-me \
HASURA_GRAPHQL_DATABASE_URL='postgres://app-user:replace-me@HOST:5432/helix_ehr' \
pnpm hasura:configure
```

### Notes for Hasura on GCP

- `NEXT_PUBLIC_HASURA_GRAPHQL_URL` should point at the public Hasura GraphQL endpoint.
- `DATABASE_URL` in the app is only needed if you later add direct server-side database access. Today, the app mainly talks to Hasura.
- For real GKE deployment, prefer Cloud SQL instead of in-cluster Postgres.
- A common next step is using the Cloud SQL Auth Proxy sidecar or private IP connectivity to reach Cloud SQL.

## License

[MIT](LICENSE)

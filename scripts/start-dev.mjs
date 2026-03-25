#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const forcedRuntime = [...args]
  .find((arg) => arg.startsWith("--runtime="))
  ?.split("=")[1];
const skipFrontend = args.has("--skip-frontend");

const postgresPort = process.env.POSTGRES_PORT ?? "5432";
const hasuraPort = process.env.HASURA_PORT ?? "8080";
const hasuraUrl = `http://localhost:${hasuraPort}`;
const adminSecret = "your-hasura-admin-secret";
const podmanNetwork = "helix-ehr";
const postgresContainer = "helix-ehr-postgres";
const hasuraContainer = "helix-ehr-hasura";
const postgresVolume = "helix-ehr-pgdata";
const podmanDatabaseUrl = "postgres://postgres:postgres@postgres:5432/helix_ehr";
const postgresImage = "docker.io/library/postgres:15";
const hasuraImage = "docker.io/hasura/graphql-engine:latest";

function commandExists(command) {
  const result = spawnSync(command, ["--version"], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: options.stdio ?? "pipe",
    shell: options.shell ?? false,
    env: { ...process.env, ...(options.env ?? {}) },
  });

  if (result.status !== 0 && !options.allowFailure) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(stderr || stdout || `${command} exited with ${result.status}`);
  }

  return result;
}

function detectRuntime() {
  if (forcedRuntime === "podman" || forcedRuntime === "docker") {
    return forcedRuntime;
  }

  if (commandExists("podman")) {
    return "podman";
  }

  if (commandExists("docker")) {
    return "docker";
  }

  return null;
}

function printStep(message) {
  console.log(`\n>> ${message}`);
}

async function waitForHasura() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await fetch(`${hasuraUrl}/healthz`);
      const text = await response.text();
      if (response.ok && text === "OK") {
        console.log("   Hasura is healthy.");
        return;
      }
    } catch {
      // Hasura is not ready yet.
    }

    console.log(`   Waiting for Hasura... (${attempt}/30)`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Hasura did not become healthy in time.");
}

async function waitForPostgres(runtime) {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const result =
      runtime === "podman"
        ? run("podman", ["exec", postgresContainer, "pg_isready", "-U", "postgres"], {
            allowFailure: true,
          })
        : run("docker", ["compose", "exec", "-T", "postgres", "pg_isready", "-U", "postgres"], {
            allowFailure: true,
          });

    if (result.status === 0) {
      console.log("   Postgres is healthy.");
      return;
    }

    console.log(`   Waiting for Postgres... (${attempt}/30)`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Postgres did not become healthy in time.");
}

function ensurePodmanNetwork() {
  const networkCheck = run("podman", ["network", "exists", podmanNetwork], {
    allowFailure: true,
  });

  if (networkCheck.status !== 0) {
    run("podman", ["network", "create", podmanNetwork], { stdio: "inherit" });
  }
}

function startPodmanStack() {
  printStep("Tearing down existing Podman containers and volumes");
  run("podman", ["rm", "-f", hasuraContainer, postgresContainer], {
    allowFailure: true,
    stdio: "ignore",
  });
  run("podman", ["volume", "rm", "-f", postgresVolume], {
    allowFailure: true,
    stdio: "ignore",
  });

  printStep("Preparing Podman network and volume");
  ensurePodmanNetwork();
  run("podman", ["volume", "create", postgresVolume], { stdio: "inherit" });

  printStep("Starting Postgres with Podman");
  run(
    "podman",
    [
      "run",
      "-d",
      "--name",
      postgresContainer,
      "--network",
      podmanNetwork,
      "--network-alias",
      "postgres",
      "-p",
      `${postgresPort}:5432`,
      "-e",
      "POSTGRES_USER=postgres",
      "-e",
      "POSTGRES_PASSWORD=postgres",
      "-e",
      "POSTGRES_DB=helix_ehr",
      "-v",
      `${postgresVolume}:/var/lib/postgresql/data`,
      "-v",
      `${path.join(root, "hasura/migrations/001_create_users/up.sql")}:/docker-entrypoint-initdb.d/01_users.sql:ro`,
      "-v",
      `${path.join(root, "hasura/migrations/002_create_patients/up.sql")}:/docker-entrypoint-initdb.d/02_patients.sql:ro`,
      "-v",
      `${path.join(root, "hasura/migrations/003_create_visits/up.sql")}:/docker-entrypoint-initdb.d/03_visits.sql:ro`,
      "-v",
      `${path.join(root, "hasura/seeds/001_seed_data.sql")}:/docker-entrypoint-initdb.d/04_seed.sql:ro`,
      postgresImage,
    ],
    { stdio: "inherit" },
  );

  printStep("Waiting for Postgres to be healthy");
  return waitForPostgres("podman").then(() => {
    printStep("Starting Hasura with Podman");
    run(
      "podman",
      [
        "run",
        "-d",
        "--name",
        hasuraContainer,
        "--network",
        podmanNetwork,
        "--network-alias",
        "hasura",
        "-p",
        `${hasuraPort}:8080`,
        "-e",
        `HASURA_GRAPHQL_DATABASE_URL=${podmanDatabaseUrl}`,
        "-e",
        "HASURA_GRAPHQL_ENABLE_CONSOLE=true",
        "-e",
        "HASURA_GRAPHQL_DEV_MODE=true",
        "-e",
        `HASURA_GRAPHQL_ADMIN_SECRET=${adminSecret}`,
        "-e",
        "HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous",
        "-e",
        "HASURA_GRAPHQL_LOG_LEVEL=warn",
        hasuraImage,
      ],
      { stdio: "inherit" },
    );
  });
}

async function startDockerStack() {
  printStep("Tearing down existing containers and volumes");
  run("docker", ["compose", "down", "-v"], {
    allowFailure: true,
    stdio: "inherit",
  });

  printStep("Starting Postgres + Hasura");
  run("docker", ["compose", "up", "-d"], { stdio: "inherit" });
}

function startFrontend() {
  printStep("Starting Next.js dev server");
  const child = spawn("pnpm", ["dev"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

async function configureHasura(databaseUrl) {
  printStep("Configuring Hasura metadata");
  run("node", ["./scripts/configure-hasura.mjs"], {
    stdio: "inherit",
    env: {
      HASURA_URL: hasuraUrl,
      HASURA_GRAPHQL_ADMIN_SECRET: adminSecret,
      HASURA_GRAPHQL_DATABASE_URL: databaseUrl,
    },
  });
}

async function main() {
  const runtime = detectRuntime();

  if (!runtime) {
    console.log("\n   No container runtime found (podman or docker).");
    console.log("   Skipping backend and starting Next.js with mock data only.\n");

    if (!skipFrontend) {
      startFrontend();
    }

    return;
  }

  console.log(`   Using runtime: ${runtime}`);

  if (runtime === "podman") {
    await startPodmanStack();
    printStep("Waiting for Hasura to be healthy");
    await waitForHasura();
    await configureHasura(podmanDatabaseUrl);
  } else {
    await startDockerStack();
    printStep("Waiting for Hasura to be healthy");
    await waitForHasura();
    await configureHasura("postgres://postgres:postgres@postgres:5432/helix_ehr");
  }

  console.log("\n\n=== Stack is ready ===");
  console.log(`  Hasura Console:  ${hasuraUrl}/console`);
  console.log(`  Admin Secret:    ${adminSecret}`);
  console.log(`  GraphQL:         ${hasuraUrl}/v1/graphql`);
  console.log("  Next.js:         http://localhost:3000");
  console.log("  Login:           admin@helix.dev / password\n");

  if (!skipFrontend) {
    startFrontend();
  }
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});

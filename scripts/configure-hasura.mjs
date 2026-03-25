#!/usr/bin/env node

const hasuraUrl = process.env.HASURA_URL ?? "http://localhost:8080";
const adminSecret =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET ?? "your-hasura-admin-secret";
const databaseUrl =
  process.env.HASURA_GRAPHQL_DATABASE_URL ??
  "postgres://postgres:postgres@postgres:5432/helix_ehr";

const metadataUrl = new URL("/v1/metadata", hasuraUrl).toString();

async function callMetadata(body) {
  const response = await fetch(metadataUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Hasura metadata call failed with ${response.status}: ${text}`,
    );
  }

  return text ? JSON.parse(text) : null;
}

async function ensureSource() {
  await callMetadata({
    type: "pg_add_source",
    args: {
      name: "default",
      configuration: {
        connection_info: {
          database_url: databaseUrl,
        },
      },
      replace_configuration: true,
    },
  }).catch((error) => {
    if (!String(error.message).includes("already exists")) {
      throw error;
    }
  });
}

async function trackTable(name) {
  await callMetadata({
    type: "pg_track_table",
    args: {
      source: "default",
      table: { schema: "public", name },
    },
  }).catch((error) => {
    if (!String(error.message).includes("already tracked")) {
      throw error;
    }
  });
}

async function trackRelationship(table, name, type, definition) {
  const metadataType =
    type === "object"
      ? "pg_create_object_relationship"
      : "pg_create_array_relationship";

  await callMetadata({
    type: metadataType,
    args: {
      source: "default",
      table: { schema: "public", name: table },
      name,
      using: definition,
    },
  }).catch((error) => {
    if (!String(error.message).includes("already exists")) {
      throw error;
    }
  });
}

async function setAggregateName(name) {
  await callMetadata({
    type: "pg_set_table_customization",
    args: {
      source: "default",
      table: { schema: "public", name },
      configuration: {
        custom_root_fields: {
          select_aggregate: `${name}_aggregate`,
        },
      },
    },
  }).catch((error) => {
    if (!String(error.message).includes("already")) {
      throw error;
    }
  });
}

async function main() {
  await ensureSource();

  for (const table of ["users", "patients", "visits"]) {
    await trackTable(table);
    await setAggregateName(table);
  }

  await trackRelationship("patients", "visits", "array", {
    foreign_key_constraint_on: {
      table: { schema: "public", name: "visits" },
      column: "patient_id",
    },
  });

  await trackRelationship("visits", "patient", "object", {
    foreign_key_constraint_on: "patient_id",
  });

  console.log(`Hasura metadata configured at ${hasuraUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

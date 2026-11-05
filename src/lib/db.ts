import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { PoolClient, Pool } from "pg";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
type Row = Record<string, any>;
export interface DB { query<T extends Row = Row>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>; }
type Embedded = import("@electric-sql/pglite").PGlite;
type Store = { client: Pool | Embedded; embedded: boolean };
const shared = globalThis as typeof globalThis & { learningDB?: Promise<Store> };
async function open(): Promise<Store> {
  let client: Pool | Embedded;
  const embedded = !process.env.DATABASE_URL;
  if (embedded) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_DB !== "true") {
      throw new Error("Produksi memerlukan DATABASE_URL PostgreSQL; ALLOW_LOCAL_DB=true hanya untuk uji lokal.");
    }
    const { PGlite } = await import("@electric-sql/pglite");
    const directory=process.env.LOCAL_DB_PATH || path.join(process.cwd(), ".data/postgres");
    await mkdir(path.dirname(directory), {recursive:true});
    client = new PGlite(directory);
    await client.waitReady;
  } else {
    const { Pool } = await import("pg");
    client = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  }
  const schema = await readFile(path.join(process.cwd(), "db/schema.sql"), "utf8");
  if (embedded) await (client as Embedded).exec(schema);
  else await (client as Pool).query(schema);
  return { client, embedded };
}
export async function store() { return shared.learningDB ??= open(); }
export const db: DB = { async query<T extends Row>(sql: string, params: unknown[] = []) {
  const s = await store();
  const result = s.embedded ? await (s.client as Embedded).query(sql, params) : await (s.client as Pool).query(sql, params);
  return { rows: result.rows as T[] };
} };
export async function transaction<T>(fn: (tx: DB) => Promise<T>): Promise<T> {
  const s = await store();
  if (s.embedded) return (s.client as Embedded).transaction(tx => fn(tx as unknown as DB));
  const client: PoolClient = await (s.client as Pool).connect();
  try {
    await client.query("BEGIN");
    // Serializes graph, active-parameter, and student-state mutations across processes.
    await client.query("SELECT pg_advisory_xact_lock(2101026)");
    const value = await fn(client as DB);
    await client.query("COMMIT");
    return value;
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}
export const id = () => randomUUID();
export const json = (value: unknown) => JSON.stringify(value);
export async function closeDB() {
  if (!shared.learningDB) return;
  const s = await shared.learningDB;
  if (s.embedded) await (s.client as Embedded).close(); else await (s.client as Pool).end();
  delete shared.learningDB;
}

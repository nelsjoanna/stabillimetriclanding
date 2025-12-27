import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log database connection info (without exposing password)
const dbUrl = process.env.DATABASE_URL;
const dbInfo = dbUrl ? new URL(dbUrl) : null;
console.log(`🔌 Connecting to database: ${dbInfo?.hostname}:${dbInfo?.port}/${dbInfo?.pathname?.slice(1)}`);

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Ensure connections are properly managed
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log pool events for debugging
pool.on('connect', () => {
  console.log('✅ New database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

export const db = drizzle(pool, { schema });

import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "bnb_hr_portal",
      user: process.env.DB_USER || "bnb_user",
      password: process.env.DB_PASSWORD || "bnb_password_2024",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    _pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }
  return _pool;
}

export const pool = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
  end: () => getPool().end(),
};

export async function query<T = any>(
  text: string,
  params?: any[],
): Promise<T[]> {
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development") {
    console.log("query", {
      text: text.slice(0, 80),
      duration,
      rows: res.rowCount,
    });
  }

  return res.rows as T[];
}

export async function queryOne<T = any>(
  text: string,
  params?: any[],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

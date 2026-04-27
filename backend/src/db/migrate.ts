import dotenv from "dotenv";
dotenv.config();

import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "../config/database";

async function migrate() {
  console.log("Running migrations...");

  const sql = readFileSync(
    join(__dirname, "migrations/001_initial.sql"),
    "utf-8",
  );

  try {
    await pool.query(sql);
    console.log("✅ Migration completed");
  } catch (err: any) {
    if (err.code === "42710" || err.message.includes("already exists")) {
      console.log("⚠️  Tables already exist, skipping");
    } else {
      console.error("❌ Migration failed:", err.message);
      throw err;
    }
  } finally {
    await pool.end();
  }
}

migrate();

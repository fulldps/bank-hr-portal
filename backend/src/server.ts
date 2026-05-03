import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { pool } from "./config/database";

async function start() {
  try {
    await pool.query("SELECT 1", []);
    console.log("✅ Database connected");

    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

start();

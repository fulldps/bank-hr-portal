import app from "./app";
import { env } from "./config/env";
import { pool } from "./config/database";

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");

    app.listen(env.PORT, () => {
      console.log(`✅ Server running on http://localhost:${env.PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

start();

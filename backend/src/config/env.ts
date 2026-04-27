export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: Number(process.env.DB_PORT) || 5432,
    NAME: process.env.DB_NAME || "bnb_hr_portal",
    USER: process.env.DB_USER || "bnb_user",
    PASSWORD: process.env.DB_PASSWORD || "",
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || "fallback_secret",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

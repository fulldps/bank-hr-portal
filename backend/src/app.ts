import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./modules/auth/auth.router";
import ticketsRouter from "./modules/tickets/tickets.router";
import tasksRouter from "./modules/tasks/tasks.router";
import shiftsRouter from "./modules/shifts/shifts.router";
import notificationsRouter from "./modules/notifications/notifications.router";
import usersRouter from "./modules/users/users.router";
import analyticsRouter from "./modules/analytics/analytics.router";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/shifts", shiftsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/analytics", analyticsRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Маршрут не найден" },
  });
});

app.use(errorHandler);

export default app;

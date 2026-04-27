import { Router } from "express";
import * as analyticsController from "./analytics.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireRole("manager", "hr", "admin"));

router.get("/kpi", analyticsController.getKpi);
router.get("/trend", analyticsController.getWeeklyTrend);
router.get("/priority", analyticsController.getPriorityStats);
router.get("/departments", analyticsController.getDepartmentStats);

export default router;

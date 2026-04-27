import { Router } from "express";
import * as shiftsController from "./shifts.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", shiftsController.getAll);
router.post("/", shiftsController.create);
router.patch(
  "/:id/approve",
  requireRole("manager", "hr", "admin"),
  shiftsController.approve,
);
router.patch(
  "/:id/reject",
  requireRole("manager", "hr", "admin"),
  shiftsController.reject,
);
router.get("/overtime", shiftsController.getOvertime);

export default router;

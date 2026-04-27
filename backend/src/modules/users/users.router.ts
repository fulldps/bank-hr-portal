import { Router } from "express";
import * as usersController from "./users.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", usersController.getAll);
router.get("/departments", usersController.getDepartments);
router.get("/:id", usersController.getOne);

export default router;

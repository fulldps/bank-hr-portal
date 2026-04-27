import { Router } from "express";
import * as authController from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.getMe);

export default router;

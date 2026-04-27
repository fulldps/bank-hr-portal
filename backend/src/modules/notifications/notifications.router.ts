import { Router } from "express";
import * as notificationsController from "./notifications.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", notificationsController.getAll);
router.get("/unread-count", notificationsController.getUnread);
router.patch("/:id/read", notificationsController.markOne);
router.patch("/read-all", notificationsController.markAll);
router.delete("/:id", notificationsController.remove);

export default router;

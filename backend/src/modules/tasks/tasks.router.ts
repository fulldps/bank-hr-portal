import { Router } from "express";
import * as tasksController from "./tasks.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", tasksController.getAll);
router.get("/:id", tasksController.getOne);
router.post("/", tasksController.create);
router.patch("/:id", tasksController.update);
router.delete("/:id", tasksController.remove);

export default router;

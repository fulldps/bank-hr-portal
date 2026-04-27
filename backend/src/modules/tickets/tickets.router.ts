import { Router } from "express";
import * as ticketsController from "./tickets.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", ticketsController.getAll);
router.get("/:id", ticketsController.getOne);
router.post("/", ticketsController.create);
router.patch("/:id", ticketsController.update);
router.delete("/:id", ticketsController.remove);

export default router;
